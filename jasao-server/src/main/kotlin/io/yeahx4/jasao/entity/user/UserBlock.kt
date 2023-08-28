package io.yeahx4.jasao.entity.user

import io.yeahx4.jasao.entity.TimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class UserBlock(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String,

    @Column
    val operator: Long,

    @Column
    val target: Long,
): TimeEntity()
