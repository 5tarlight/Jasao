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
import io.yeahx4.jasao.role.file.FileExtension
import io.yeahx4.jasao.role.user.UserRole
import io.yeahx4.jasao.service.file.UploadedFileService
import io.yeahx4.jasao.service.uuid.UuidService
import io.yeahx4.jasao.service.user.RefreshTokenService
import io.yeahx4.jasao.service.user.UserService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.MessageHttpResponse
import io.yeahx4.jasao.util.MsgRes
import io.yeahx4.jasao.util.Res
import jakarta.servlet.http.HttpServletResponse
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

/**
 * # Features
 * - User CRU(D)
 * - Login & Logout
 * - JWT refresh
 *
 * @since 1.0.0
 * @see UserService
 * @see JwtTokenProvider
 * @see JwtService
 * @see UuidService
 * @see RefreshTokenService
 */
@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService,
    private val jwtTokenProvider: JwtTokenProvider,
    private val jwtService: JwtService,
    private val uuidService: UuidService,
    private val refreshTokenService: RefreshTokenService,
    private val uploadedFileService: UploadedFileService,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    /**
     * Create new User
     *
     * # Request
     *
     * ### HTTP
     * POST `/user/signup`
     *
     * ### Body
     * - email: String
     * - username: String
     * - password: String raw password
     *
     * # Response
     * - 201 : Success
     * - 400 : Email or username is already taken
     *
     * @since 1.0.0
     */
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

    /**
     * Login to signed-up user.
     * Require http-only cookie.
     *
     * # Request
     * ### HTTP
     * POST `/user/login`
     *
     * ### Body
     * - email: String
     * - password: String raw password
     *
     * # Response
     * - 400 : Email is not valid format (disabled)
     * - 404 : Invalid email or password
     * - 200 : Success
     * ```json
     * {
     *      "id": String,
     *      "email": String,
     *      "username": String,
     *      "role": String (enum),
     *      "profile": String? possibly "",
     *      "bio": String? possibly "",
     *      "token": String JWT
     * }
     * ```
     */
    @PostMapping("/login")
    fun login(@RequestBody dto: LoginDto, response: HttpServletResponse): Res<LoginResDto> {
//        if (!isEmail(dto.email))
//            return Res(HttpResponse("Invalid format of email", null), HttpStatus.BAD_REQUEST)

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

    /**
     * Update user data
     *
     * # Request
     * ### HTTP
     * PATCH `/auth/update`
     *
     * ### Body
     * - username: String?
     * - password: String?
     * - bio: String?
     * - oldPassword: String
     *
     * # Response
     * - 403 : Invalid password
     * - 200 : Success
     */
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

        if (dto.bio != null) {
            logger.info("Update user  ${user.getRealUsername()}(${user.id})'s bio")
            tUser.bio = dto.bio
        }

        return Res(HttpResponse("Success", null), HttpStatus.OK)
    }

    /**
     * Refresh JWT
     *
     * # Request
     * ### HTTP
     * POST `/user/refresh`
     *
     * ### Header
     * - Authorization: JWT
     *
     * # Response
     * - 400 : Unknown refresh token. Generally logged out
     * - 400 : Expired token. login again.
     * - 400 : Delete user
     * - 403 : Suspicious. Logout all account now.
     * - 200 : Success
     */
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

    /**
     * Logout
     *
     * # Request
     * ### HTTP
     * GET `/user/auth/logout`
     *
     * ### Header
     * Authorization: JWT
     *
     * # Response
     * - 403 : Refresh token is null
     * - 404 : Token is not valid
     * - 200 : Success
     */
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

    /**
     * Get user by ID
     *
     * # Request
     * ### HTTP
     * GET `/user/id`
     *
     * ### Param
     * id: Long
     *
     * # Response
     * - 404 : Not Found
     * - 200 : Success
     * ```json
     * {
     *      "id": Long,
     *      "email": String,
     *      "username": String,
     *      "role": String (enum),
     *      "profile": String? possibly "",
     *      "bio": String
     * }
     * ```
     */
    @GetMapping("/id")
    fun getUserById(@RequestParam id: Long): Res<UserDto> {
        val user = this.userService.getUserById(id)
            ?: return Res(HttpResponse("Not Found", null), HttpStatus.NOT_FOUND)

        this.logger.info("User $id profile request")
        return Res(HttpResponse("Ok", user.toDto()), HttpStatus.OK)
    }

    /**
     * Get my details
     *
     * # Request
     * ### HTTP
     * GET `/user/auth/me`
     *
     * ### Header
     * Authorization: JWT
     *
     * # Response
     * - 200 : Success
     * ```json
     * {
     *      "id": Long,
     *      "email": String,
     *      "username": String,
     *      "role": String (enum),
     *      "profile": String? possibly "",
     *      "bio": String
     * }
     * ```
     */
    @GetMapping("/auth/me")
    fun getMyProfile(@RequestHeader("Authorization") jwt: String): Res<UserDto> {
        val user = this.jwtService.getUserFromToken(jwt)

        this.logger.info("User ${user.id} self identification")
        return Res(HttpResponse("Ok", user.toDto()), HttpStatus.OK)
    }

    /**
     * Upload profile image
     *
     * # Request
     * ### HTTP
     * POST `/user/auth/upload`
     *
     * ### body
     * - MultipartFile
     *
     * # Response
     * - 200 : Success
     * - 400 : Invalid file format. Not jpg or png
     */
    @PostMapping("/auth/profile")
    @Transactional
    fun uploadImage(
        @RequestHeader("Authorization") jwt: String,
        @RequestBody file: MultipartFile
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)

        val ext = when (file.contentType) {
            "image/jpeg" -> {
                ".jpg"
            }
            "image/png" -> {
                ".png"
            }
            else -> {
                return Res(HttpResponse("Invalid file format", null), HttpStatus.BAD_REQUEST)
            }
        }

        val path = this.userService.saveProfileImage(user.id, file, ext)

        if (user.profile != "") {
            val img = this.uploadedFileService.getProfileImageByOwner(user.id)!!
            img.extension = if (ext == ".jpg") FileExtension.JPEG else FileExtension.PNG
            img.path = "/images/${user.id}/profile${ext}"
        } else {
            this.uploadedFileService.saveProfileImage(user.id, ext)
        }

        val dbUser = userService.getUserById(user.id)!!
        dbUser.profile = path

        this.logger.info("Profile image upload by user ${user.id}")

        return Res(HttpResponse("Ok", path), HttpStatus.OK)
    }

    /**
     * Delete profile image
     *
     * # Request
     * ### HTTP
     * DELETE `/user/auth/profile/delete`
     *
     * ### Header
     * - Authorization: JWT
     *
     * # Response
     * - 400 : Image not exists
     * - 200 : Success
     */
    @DeleteMapping("/auth/profile/delete")
    @Transactional
    fun deleteProfileImage(@RequestHeader("Authorization") jwt: String): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)
        val dbUser = this.userService.getUserById(user.id)!!

        if (!this.userService.deleteProfileImage(user.id, user.profile.endsWith(".jpg"))) {
            this.logger.warn("User ${user.id} tried to delete non-exist profile image")
            return Res(HttpResponse("File not exists", null), HttpStatus.BAD_REQUEST)
        } else {
            this.uploadedFileService.deleteProfileImage(user.id)
            dbUser.profile = ""
        }

        this.logger.info("User ${user.id} removed its profile image")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }
}
