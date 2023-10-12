package io.yeahx4.jasao.util

import io.yeahx4.jasao.role.file.FileExtension
import org.springframework.web.multipart.MultipartFile

fun getExtension(file: MultipartFile): FileExtension {
    return when (file.contentType) {
        "image/jpeg" -> FileExtension.JPEG
        "image/png" -> FileExtension.PNG
        else -> FileExtension.OTHER
    }
}
