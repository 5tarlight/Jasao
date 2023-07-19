package io.yeahx4.jasao.entity.cafe

import io.yeahx4.jasao.entity.TimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class CafeSetting(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column
    val cafe: Long
): TimeEntity() {
    companion object {
        fun default(cafeId: Long): CafeSetting {
            return CafeSetting(
                -1,
                cafeId
            )
        }
    }
}
