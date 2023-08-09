package io.yeahx4.jasao.entity.user

import io.yeahx4.jasao.dto.user.UserDto
import io.yeahx4.jasao.entity.TimeEntity
import io.yeahx4.jasao.role.UserRole
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import lombok.Setter
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Entity
@Setter
class User(
    id: Long,
    email: String,
    username: String,
    password: String,
    role: UserRole
): TimeEntity(), UserDetails {
    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = id

    @Column(nullable = false, length = 100)
    private var email: String = email

    @Column(nullable = false, length = 20)
    private var username :String = username

    @Column(nullable = false, length = 255)
    private var password: String = password

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val role: UserRole = role

    @Column(nullable = true)
    val profile: String = ""

    fun toDto(): UserDto {
        return UserDto(
            this.id,
            this.email,
            this.username,
            this.role
        )
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf(SimpleGrantedAuthority(this.role.toString()))
    }

    override fun getPassword(): String {
        return this.password
    }

    override fun getUsername(): String {
        return email
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }

    fun getEmail() = email

    fun setEmail(email: String) {
        this.email = email
    }

    fun getRealUsername() = username

    fun setRealUsername(username: String) {
        this.username = username
    }

    fun setEncryptedPassword(password: String) {
        this.password = password
    }
}
