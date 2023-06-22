package io.yeahx4.jasao.service.auth

import io.yeahx4.jasao.entity.User
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class JwtService {
    fun getEmailFromToken(token: String): User {
        val auth = SecurityContextHolder.getContext().authentication

        return auth.principal as User
    }
}
