package io.yeahx4.jasao.entity.user

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne

@Entity
data class Following(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String,

    @ManyToOne(cascade = [CascadeType.REMOVE], fetch = FetchType.LAZY, targetEntity = User::class)
    @JoinColumn
    val follower: User,

    @ManyToOne(cascade = [CascadeType.REMOVE], fetch = FetchType.LAZY, targetEntity = User::class)
    @JoinColumn
    val followed: User,
)
