package io.yeahx4.jasao.repository

import io.yeahx4.jasao.entity.cafe.Cafe
import org.springframework.data.jpa.repository.JpaRepository

interface CafeRepository: JpaRepository<Cafe, Long> {
    fun findByName(name: String): Cafe?
    fun findByIdentifier(identifier: String): Cafe?
    fun findAllByOwner(owner: Long): List<Cafe>
}
