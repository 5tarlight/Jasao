package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.User
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class JwtService {
    fun getUserFromToken(token: String): User {
        val auth = SecurityContextHolder.getContext().authentication

        return auth.principal as User
    }
}
