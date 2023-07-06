package io.yeahx4.jasao.controller

import io.yeahx4.jasao.dto.LoginDto
import io.yeahx4.jasao.dto.LoginResDto
import io.yeahx4.jasao.dto.SignUpDto
import io.yeahx4.jasao.dto.UpdateUserDto
import io.yeahx4.jasao.entity.User
import io.yeahx4.jasao.service.auth.JwtService
import io.yeahx4.jasao.jwt.JwtTokenProvider
import io.yeahx4.jasao.role.UserRole
import io.yeahx4.jasao.service.auth.UserService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.MessageHttpResponse
import io.yeahx4.jasao.util.MsgRes
import io.yeahx4.jasao.util.Res
import io.yeahx4.jasao.util.isEmail
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService,
    private val jwtTokenProvider: JwtTokenProvider,
    private val jwtService: JwtService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/signup")
    fun signup(@RequestBody dto: SignUpDto): MsgRes {
        val check = this.userService.isDuplicatedSignup(dto)
        return if (!check.first) {
            if (check.second == "email")
                logger.info("Sign up failed due to duplicated ${check.second}: ${dto.email}")
            else
                logger.info("Sign up failed due to duplicated ${check.second}: ${dto.username}")

            MsgRes(MessageHttpResponse("Duplicated ${check.second}."), HttpStatus.BAD_REQUEST)
        } else {
            this.userService.saveUser(User(
                -1,
                dto.email,
                dto.username,
                this.userService.encrypt(dto.password),
                UserRole.USER
            ))

            logger.info("New user created: ${dto.username}")

            MsgRes(MessageHttpResponse("Success"), HttpStatus.CREATED)
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody dto: LoginDto): Res<LoginResDto> {
        if (!isEmail(dto.email))
            return Res(HttpResponse("Invalid format of email", null), HttpStatus.BAD_REQUEST)

        val user = this.userService.getUserByEmail(dto.email)

        if (user == null) {
            logger.info("Log in attempt failed: ${dto.email} Unknown email")
            return Res(HttpResponse("Invalid credentials.", null), HttpStatus.NOT_FOUND)
        }

        val match = this.userService.matchPassword(dto.password, user.password)

        if (!match) {
            logger.info("Log in attempt failed: ${dto.email} Invalid password")
            return Res(HttpResponse("Invalid credentials.", null), HttpStatus.NOT_FOUND)
        }

        val token = jwtTokenProvider.createToken(user.getEmail())
        logger.info("Log in successful: ${dto.email} $token")
        return Res(HttpResponse("Ok", user.toDto().toLoginRes(token)), HttpStatus.OK)
    }

//    @PostMapping("/auth/test")
//    fun test(@RequestHeader("Authorization") token: String): String {
//        val user = jwtService.getUserFromToken(token)
//        return "Welcome ${user.getRealUsername()}"
//    }

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

        if (dto.username != null) {
            user.setRealUsername(dto.username)
        }

        if (dto.password != null) {
            user.setEncryptedPassword(this.userService.encrypt(dto.password))
        }

        return Res(HttpResponse("Success", null), HttpStatus.OK)
    }
}
