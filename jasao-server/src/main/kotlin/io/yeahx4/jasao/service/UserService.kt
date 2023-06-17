package io.yeahx4.jasao.service

import io.yeahx4.jasao.dto.SignUpDto
import io.yeahx4.jasao.entity.User
import io.yeahx4.jasao.repository.UserRepository
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val encoder: BCryptPasswordEncoder
) {
    fun saveUser(user: User) {
        this.userRepository.save(user)
    }

    fun isDuplicatedSignup(dto: SignUpDto): Pair<Boolean, String> {
        val emailUser = this.userRepository.findByEmail(dto.email)
        if (emailUser != null) {
            return Pair(false, "email")
        }

        val usernameUser = this.userRepository.findByUsername(dto.username)
        if (usernameUser != null) {
            return Pair(false, "username")
        }

        return Pair(true, "")
    }

    fun encrypt(password: String): String {
        return this.encoder.encode(password)
    }
}
