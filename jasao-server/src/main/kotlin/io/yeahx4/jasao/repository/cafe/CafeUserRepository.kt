package io.yeahx4.jasao.repository.cafe

import io.yeahx4.jasao.entity.cafe.CafeUser
import org.springframework.data.jpa.repository.JpaRepository

interface CafeUserRepository: JpaRepository<CafeUser, Long> {
}
