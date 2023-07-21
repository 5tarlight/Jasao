package io.yeahx4.jasao.dto.user

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
) {
    fun toLoginRes(token: String): LoginResDto {
        return LoginResDto(
            id,
            email,
            username,
            role,
            token
        )
    }
}

data class LoginResDto(
    val id: Long,
    val email: String,
    val username: String,
    val role: UserRole,
    val token: String
)

data class UpdateUserDto(
    val username: String?,
    val password: String?,
    val oldPassword: String
)

data class RefreshResDto(
    val token: String
)
