package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.RefreshToken
import io.yeahx4.jasao.repository.user.RefreshTokenRepository
import org.springframework.stereotype.Service

@Service
class RefreshTokenService(private val refreshTokenRepository: RefreshTokenRepository) {
    fun isRefreshTokenDuplicated(token: String): Boolean {
        return this.refreshTokenRepository.findByRefresh(token) != null
    }

    fun saveRefreshToken(refresh: String, jwt: String) {
        this.refreshTokenRepository.save(
            RefreshToken("", refresh, jwt)
        )
    }

    fun findByRefresh(refresh: String): RefreshToken? {
        return this.refreshTokenRepository.findByRefresh(refresh)
    }

    fun findRefreshJwtPair(refresh: String, jwt: String): RefreshToken? {
        return this.refreshTokenRepository.findByRefreshAndJwt(refresh, jwt)
    }
}
