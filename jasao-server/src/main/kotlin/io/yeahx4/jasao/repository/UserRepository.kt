package io.yeahx4.jasao.repository

import io.yeahx4.jasao.entity.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
    fun findByEmail(email: String): User?
}
