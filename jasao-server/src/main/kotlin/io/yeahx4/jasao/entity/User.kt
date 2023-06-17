package io.yeahx4.jasao.entity

import io.yeahx4.jasao.dto.UserDto
import io.yeahx4.jasao.role.UserRole
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class User(
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(nullable = false, length = 100)
    val email: String,

    @Column(nullable = false, length = 30)
    val username :String,

    @Column(nullable = false, length = 255)
    val password: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val role: UserRole
) : TimeEntity() {
    fun toDto(): UserDto {
        return UserDto(
            this.id,
            this.email,
            this.username,
            this.role
        )
    }
}
