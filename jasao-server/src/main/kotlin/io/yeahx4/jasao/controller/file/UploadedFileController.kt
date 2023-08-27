package io.yeahx4.jasao.controller.file

import io.yeahx4.jasao.service.file.UploadedFileService
import io.yeahx4.jasao.service.user.JwtService
import io.yeahx4.jasao.service.user.UserService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.Res
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/file")
class UploadedFileController(
    private val jwtService: JwtService,
    private val uploadedFileService: UploadedFileService,
    private val userService: UserService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/auth/upload")
    @Transactional
    fun uploadImage(
        @RequestHeader("Authorization") jwt: String,
        @RequestParam role: String,
        @RequestBody file: MultipartFile
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)

        return if (role == "profile") {
            val path = this.uploadedFileService.saveProfileImage(user.id, file)
            val dbUser = userService.getUserById(user.id)!!
            dbUser.profile = path

            this.logger.info("Profile image upload by user ${user.id}")

            Res(HttpResponse("Ok", path), HttpStatus.OK)
        } else {
            this.logger.warn("Invalid role(${role}) image upload request by user ${user.id}")

            Res(HttpResponse("Invalid role", null), HttpStatus.BAD_REQUEST)
        }
    }

    @DeleteMapping("/auth/profile/delete")
    @Transactional
    fun deleteProfileImage(@RequestHeader("Authorization") jwt: String): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt);
        val dbUser = this.userService.getUserById(user.id)!!

        if (!this.uploadedFileService.deleteProfileImage(user.id, user.profile.endsWith(".jpg"))) {
            this.logger.warn("User ${user.id} tried to delete non-exist profile image.")
            return Res(HttpResponse("File not exists", null), HttpStatus.BAD_REQUEST)
        } else {
            dbUser.profile = ""
        }

        this.logger.info("User ${user.id} removed its profile image.")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }
}
