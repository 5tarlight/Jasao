package io.yeahx4.jasao.service.cafe

import io.yeahx4.jasao.dto.cafe.CreateCafeDto
import io.yeahx4.jasao.entity.user.User
import io.yeahx4.jasao.entity.cafe.Cafe
import io.yeahx4.jasao.repository.cafe.CafeRepository
import io.yeahx4.jasao.util.unwrap
import org.springframework.stereotype.Service

@Service
class CafeService(private val cafeRepository: CafeRepository) {
    fun create(dto: CreateCafeDto, owner: Long): Cafe {
        return cafeRepository.save(Cafe(
            -1,
            dto.identifier,
            dto.name,
            dto.description ?: "",
            owner,
            null,
            null,
        ))
    }

    fun getCafeByIdentifier(identifier: String): Cafe? {
        return this.cafeRepository.findByIdentifier(identifier)
    }

    fun getAllCafeByOwner(owner: Long): List<Cafe> {
        return this.cafeRepository.findAllByOwner(owner)
    }

    fun isOwner(cafe: Cafe, user: User): Boolean {
        return cafe.owner == user.id
    }

    fun getCafeById(id: Long): Cafe? {
        return unwrap(this.cafeRepository.findById(id))
    }
}
