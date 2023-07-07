package io.yeahx4.jasao.service.cafe

import io.yeahx4.jasao.dto.cafe.CreateCafeDto
import io.yeahx4.jasao.entity.cafe.Cafe
import io.yeahx4.jasao.repository.CafeRepository
import org.springframework.stereotype.Service

@Service
class CafeService(private val cafeRepository: CafeRepository) {
    fun create(dto: CreateCafeDto, owner: Long) {
        cafeRepository.save(Cafe(
            -1,
            dto.identifier,
            dto.name,
            dto.description ?: "",
            owner
        ))
    }

    fun getCafeByIdentifier(identifier: String): Cafe? {
        return this.cafeRepository.findByIdentifier(identifier)
    }
}
