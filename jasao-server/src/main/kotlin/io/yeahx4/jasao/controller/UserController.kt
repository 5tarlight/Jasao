package io.yeahx4.jasao.controller

import io.yeahx4.jasao.dto.LoginDto
import io.yeahx4.jasao.dto.SignUpDto
import io.yeahx4.jasao.dto.UserDto
import io.yeahx4.jasao.entity.User
import io.yeahx4.jasao.role.UserRole
import io.yeahx4.jasao.service.UserService
import io.yeahx4.jasao.util.*
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(private val userService: UserService) {
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
    fun login(@RequestBody dto: LoginDto): Res<UserDto> {
        val user: User? = if (isEmail(dto.email)) {
            this.userService.getUserByEmail(dto.email)
        } else {
            this.userService.getUserByUsername(dto.email)
        }

        if (user == null) {
            logger.info("Log in attempt failed: ${dto.email}")
            return Res(HttpResponse("Invalid credentials.", null), HttpStatus.NOT_FOUND)
        }

        logger.info("Log in successful: ${dto.email}")
        return Res(HttpResponse("Ok", user.toDto()), HttpStatus.OK)
    }
}
