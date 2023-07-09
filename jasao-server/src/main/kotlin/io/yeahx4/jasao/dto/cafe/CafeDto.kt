package io.yeahx4.jasao.dto.cafe

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
