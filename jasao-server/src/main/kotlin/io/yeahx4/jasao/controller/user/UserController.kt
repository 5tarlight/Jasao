package io.yeahx4.jasao.controller.user

import io.yeahx4.jasao.dto.user.LoginDto
import io.yeahx4.jasao.dto.user.LoginResDto
import io.yeahx4.jasao.dto.user.RefreshResDto
import io.yeahx4.jasao.dto.user.SignUpDto
import io.yeahx4.jasao.dto.user.UpdateUserDto
import io.yeahx4.jasao.dto.user.UserDto
import io.yeahx4.jasao.entity.user.User
import io.yeahx4.jasao.service.user.JwtService
import io.yeahx4.jasao.jwt.JwtTokenProvider
import io.yeahx4.jasao.role.user.UserRole
import io.yeahx4.jasao.service.UuidService
import io.yeahx4.jasao.service.user.RefreshTokenService
import io.yeahx4.jasao.service.user.UserService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.MessageHttpResponse
import io.yeahx4.jasao.util.MsgRes
import io.yeahx4.jasao.util.Res
import io.yeahx4.jasao.util.isEmail
import jakarta.servlet.http.HttpServletResponse
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService,
    private val jwtTokenProvider: JwtTokenProvider,
    private val jwtService: JwtService,
    private val uuidService: UuidService,
    private val refreshTokenService: RefreshTokenService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/signup")
    fun signup(@RequestBody dto: SignUpDto): MsgRes {
        val check = this.userService.isDuplicatedSignup(dto)
        return if (!check.first) {
            if (check.second == "email")
                logger.warn("Sign up failed due to duplicated ${check.second}: ${dto.email}")
            else
                logger.warn("Sign up failed due to duplicated ${check.second}: ${dto.username}")

            MsgRes(MessageHttpResponse("Duplicated ${check.second}."), HttpStatus.BAD_REQUEST)
        } else {
            this.userService.saveUser(
                User(
                    -1,
                    dto.email,
                    dto.username,
                    this.userService.encrypt(dto.password),
                    UserRole.USER
                )
            )

            logger.info("New user created: ${dto.username}")

            MsgRes(MessageHttpResponse("Success"), HttpStatus.CREATED)
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody dto: LoginDto, response: HttpServletResponse): Res<LoginResDto> {
        if (!isEmail(dto.email))
            return Res(HttpResponse("Invalid format of email", null), HttpStatus.BAD_REQUEST)

        val user = this.userService.getUserByEmail(dto.email)

        if (user == null) {
            logger.warn("Log in attempt failed: ${dto.email} Unknown email")
            return Res(HttpResponse("Invalid credentials.", null), HttpStatus.NOT_FOUND)
        }

        val match = this.userService.matchPassword(dto.password, user.password)

        if (!match) {
            logger.warn("Log in attempt failed: ${dto.email} Invalid password")
            return Res(HttpResponse("Invalid credentials.", null), HttpStatus.NOT_FOUND)
        }

        var refreshToken: String
        do {
            refreshToken = uuidService.createUuid()
        } while (this.refreshTokenService.isRefreshTokenDuplicated(refreshToken))

        val cookie = ResponseCookie.from("refreshToken")
            .maxAge(7 * 24 * 60 * 60)
            .path("/")
            .sameSite("None")
            .httpOnly(true)
            .secure(true)
            .value(refreshToken)
            .build()
        response.setHeader("Set-Cookie", cookie.toString())

        val token = jwtTokenProvider.createToken(user.getEmail())

        this.refreshTokenService.saveRefreshToken(refreshToken, token, user.id)

        logger.info("Log in successful: ${dto.email} refresh: $refreshToken")
        return Res(HttpResponse("Ok", user.toDto().toLoginRes(token)), HttpStatus.OK)
    }

    @Transactional
    @PatchMapping("/auth/update")
    fun update(
        @RequestHeader("Authorization") token: String,
        @RequestBody dto: UpdateUserDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(token)
        val pwMatch = this.userService.matchPassword(dto.oldPassword, user.password)

        if (!pwMatch) {
            return Res(HttpResponse("Invalid Credential", null), HttpStatus.FORBIDDEN)
        }

        val tUser = this.userService.getUserByEmail(user.getEmail())!!

        if (dto.username != null) {
            logger.info("Update user ${user.getRealUsername()}(${user.id})'s username ${dto.username}")
            tUser.setRealUsername(dto.username)
        }

        if (dto.password != null) {
            logger.info("Update user ${user.getRealUsername()}(${user.id})'s password")
            tUser.setEncryptedPassword(this.userService.encrypt(dto.password))
        }

        return Res(HttpResponse("Success", null), HttpStatus.OK)
    }

    @PostMapping("/refresh")
    @Transactional
    fun refresh(
        @CookieValue refreshToken: String?,
        @RequestHeader("Authorization") token: String?,
        response: HttpServletResponse
    ): Res<RefreshResDto> {
        if (refreshToken == null) {
            this.logger.warn("Refresh token was not provided.")
            return Res(HttpResponse("Login First", null), HttpStatus.BAD_REQUEST)
        }

        if (token == null) {
            this.logger.warn("JWT refresh request denied: Login First. refresh: $refreshToken")
            return Res(HttpResponse("Login First", null), HttpStatus.BAD_REQUEST)
        }

        val byRefresh = this.refreshTokenService.findByRefresh(refreshToken)
        val pair = this.refreshTokenService.findRefreshJwtPair(refreshToken, token)

        if (byRefresh == null) {
            this.logger.warn("Unknown refresh token: $refreshToken")
            return Res(HttpResponse("Invalid Access", null), HttpStatus.BAD_REQUEST)
        }
        if (pair == null) {
            this.logger.warn("Suspicious refresh request: $refreshToken")
            this.refreshTokenService.deleteAllByUser(byRefresh.user)
            return Res(HttpResponse("Suspicious Access", null), HttpStatus.FORBIDDEN)
        }
        if (byRefresh.expired) {
            this.logger.warn("Expired refresh request: $refreshToken")

            // Remove http-only cookie
            val cookie = ResponseCookie.from("refreshToken")
                .maxAge(0)
                .path("/")
                .sameSite("None")
                .httpOnly(true)
                .secure(true)
                .build()
            response.setHeader("Set-Cookie", cookie.toString())
            this.refreshTokenService.deleteByRefresh(refreshToken)

            return Res(HttpResponse("Expired Token", null), HttpStatus.BAD_REQUEST)
        }

        val user = this.userService.getUserById(byRefresh.user)

        if (user == null) {
            // Refresh of deleted account
            this.logger.warn("Unknown user refresh token: user ${byRefresh.user} refresh $refreshToken")
            return Res(HttpResponse("Unknown User", null), HttpStatus.BAD_REQUEST)
        }

        val newToken = this.jwtTokenProvider.createToken(user.getEmail())

        byRefresh.jwt = newToken

        val cookie = ResponseCookie.from("refreshToken")
            .maxAge(7 * 24 * 60 * 60)
            .path("/")
            .sameSite("None")
            .httpOnly(true)
            .secure(true)
            .value(refreshToken)
            .build()
        response.setHeader("Set-Cookie", cookie.toString())

        this.logger.info("Successful JWT token refresh: refresh $refreshToken")

        return Res(HttpResponse("Ok", RefreshResDto(newToken)), HttpStatus.OK)
    }

    @GetMapping("/auth/logout")
    @Transactional
    fun logout(
        @CookieValue refreshToken: String?,
        @RequestHeader("Authorization") jwt: String,
        response: HttpServletResponse
    ): Res<String> {
        if (refreshToken == null) {
            this.logger.warn("Logout without refresh token. jwt: $jwt")
            return Res(HttpResponse("Login First", null), HttpStatus.FORBIDDEN)
        }
        val pair = this.refreshTokenService.findRefreshJwtPair(refreshToken, jwt)

        if (pair == null) {
            this.logger.warn("Invalid refresh and jwt pair: ($refreshToken, $jwt)")

            val cookie = ResponseCookie.from("refreshToken")
                .maxAge(0)
                .path("/")
                .sameSite("None")
                .secure(true)
                .httpOnly(true)
                .build()
            response.setHeader("Set-Cookie", cookie.toString())

            return Res(HttpResponse("Invalid Token", null), HttpStatus.BAD_REQUEST)
        }

        val cookie = ResponseCookie.from("refreshToken")
            .maxAge(0)
            .path("/")
            .sameSite("None")
            .secure(true)
            .httpOnly(true)
            .build()
        response.setHeader("Set-Cookie", cookie.toString())
        this.refreshTokenService.deleteByRefresh(refreshToken)

        this.logger.info("Successful logout user ${pair.user}")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }

//    @PostMapping("/picture")
//    fun uploadPicture(
//        @RequestHeader("Authorization") jwt: String,
//        @RequestBody file: MultipartFile
//    ): String {
//        val user = this.jwtService.getUserFromToken(jwt)
//        return this.userService.savePicture(user.id, file)
//    }

    @GetMapping("/id")
    fun getUserById(@RequestParam id: Long): Res<UserDto> {
        val user = this.userService.getUserById(id)
            ?: return Res(HttpResponse("Not Found", null), HttpStatus.NOT_FOUND)

        return Res(HttpResponse("Ok", user.toDto()), HttpStatus.OK)
    }
}
