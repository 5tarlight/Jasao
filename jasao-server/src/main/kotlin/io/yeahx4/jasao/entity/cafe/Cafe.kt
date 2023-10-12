package io.yeahx4.jasao.entity.cafe

import io.yeahx4.jasao.entity.TimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Cafe(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(length = 20, nullable = false)
    val identifier: String,

    @Column(length = 20, nullable = false)
    var name: String,

    @Column(length = 200)
    var description: String,

    @Column(nullable = false)
    var owner: Long,

    @Column(nullable = true)
    var icon: String?,
): TimeEntity()
