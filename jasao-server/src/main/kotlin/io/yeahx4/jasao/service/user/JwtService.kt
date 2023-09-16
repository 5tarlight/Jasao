package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.User
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

/**
 * Service for parsing JWT
 */
@Service
class JwtService {
    /**
     * Parse user data from JWT.
     * Result of this query must not be null.
     */
    fun getUserFromToken(token: String): User {
        val auth = SecurityContextHolder.getContext().authentication

        return auth.principal as User
    }
}
