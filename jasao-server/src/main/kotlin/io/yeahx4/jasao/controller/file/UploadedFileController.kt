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

/**
 * Controller for file upload system
 *
 * @since 1.1.0
 */
@RestController
@RequestMapping("/file")
class UploadedFileController(
    private val jwtService: JwtService,
    private val uploadedFileService: UploadedFileService,
    private val userService: UserService,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)
}
