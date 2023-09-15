package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.RefreshToken
import io.yeahx4.jasao.repository.user.RefreshTokenRepository
import org.springframework.stereotype.Service

/**
 * Refresh token service required for JWT system.
 *
 * @since 1.0.0
 */
@Service
class RefreshTokenService(private val refreshTokenRepository: RefreshTokenRepository) {
    /**
     * Check if refresh token is in use.
     */
    fun isRefreshTokenDuplicated(token: String): Boolean {
        return this.refreshTokenRepository.findByRefresh(token) != null
    }

    /**
     * Save refresh token and JWT pair to DB
     */
    fun saveRefreshToken(refresh: String, jwt: String, user: Long) {
        this.refreshTokenRepository.save(
            RefreshToken("", refresh, jwt, user, false)
        )
    }

    /**
     * Find refresh token
     */
    fun findByRefresh(refresh: String): RefreshToken? {
        return this.refreshTokenRepository.findByRefresh(refresh)
    }

    /**
     * Find refresh token with refresh token and JWT pair
     */
    fun findRefreshJwtPair(refresh: String, jwt: String): RefreshToken? {
        return this.refreshTokenRepository.findByRefreshAndJwt(refresh, jwt)
    }

    /**
     * Delete all refresh token of target user.
     * This execution will cause every account of target user be logged out.
     */
    fun deleteAllByUser(user: Long) {
        this.refreshTokenRepository.deleteAllByUser(user)
    }

    /**
     * Delete refresh token.
     * This execution will cause login session with target refresh token be logged out.
     */
    fun deleteByRefresh(refresh: String) {
        this.refreshTokenRepository.deleteByRefresh(refresh)
    }
}
