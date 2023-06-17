package io.yeahx4.jasao.dto

import io.yeahx4.jasao.role.UserRole

data class SignUpDto(
    val email: String,
    val username: String,
    val password: String
)

data class LoginDto(
    val email: String,
    val password: String
)

data class UserDto(
    val id: Long,
    val email: String,
    val username: String,
    val role: UserRole
)
