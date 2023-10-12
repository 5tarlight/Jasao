package io.yeahx4.jasao.dto.cafe

import org.springframework.web.multipart.MultipartFile

data class CreateCafeDto(
    val name: String,
    val identifier: String,
    val description: String?
)

data class UpdateCafeDto(
    val oldPassword: String,
    val cafe: Long,
    val name: String?,
    val description: String?
)

data class UploadCafeIconDto(
    val file: MultipartFile,
    val identifier: String
)

data class DeleteCafeIconDto(
    val identifier: String
)