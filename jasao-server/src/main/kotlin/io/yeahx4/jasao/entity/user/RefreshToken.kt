package io.yeahx4.jasao.entity.user

import io.yeahx4.jasao.entity.TimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class RefreshToken(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String,

    @Column(nullable = false)
    val refresh: String,

    @Column
    var jwt: String,

    @Column(nullable = false)
    val user: Long,

    @Column(nullable = false)
    var expired: Boolean
): TimeEntity()
