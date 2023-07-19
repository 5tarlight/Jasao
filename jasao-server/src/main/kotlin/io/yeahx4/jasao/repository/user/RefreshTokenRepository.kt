package io.yeahx4.jasao.repository.user

import io.yeahx4.jasao.entity.user.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository

interface RefreshTokenRepository: JpaRepository<RefreshToken, String> {
    fun findByRefresh(refresh: String): RefreshToken?
}
