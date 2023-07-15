package io.yeahx4.jasao.service.cafe

import io.yeahx4.jasao.entity.cafe.CafeSetting
import io.yeahx4.jasao.repository.cafe.CafeSettingRepository
import org.springframework.stereotype.Service

@Service
class CafeSettingService(private val cafeSettingRepository: CafeSettingRepository) {
    fun createDefault(cafe: Long) {
        cafeSettingRepository.save(CafeSetting.default(cafe))
    }
}
