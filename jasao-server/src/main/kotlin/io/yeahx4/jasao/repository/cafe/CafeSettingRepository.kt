package io.yeahx4.jasao.repository.cafe

import io.yeahx4.jasao.entity.cafe.CafeSetting
import org.springframework.data.jpa.repository.JpaRepository

interface CafeSettingRepository: JpaRepository<CafeSetting, Long> {
}