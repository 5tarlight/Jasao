package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.dto.user.SignUpDto
import io.yeahx4.jasao.entity.user.User
import io.yeahx4.jasao.repository.user.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File

/**
 * Service for user system management.
 * CRUD for user details, JWT system.
 *
 * @since 1.0.0
 * @see User
 */
@Service
class UserService(
    private val userRepository: UserRepository,
    private val encoder: BCryptPasswordEncoder
) {
    /**
     * Save User instance to DB.
     */
    fun saveUser(user: User) {
        this.userRepository.save(user)
    }

    /**
     * Check if user with duplicated or taken credentials is trying to newly sign up.
     */
    fun isDuplicatedSignup(dto: SignUpDto): Pair<Boolean, String> {
        val emailUser = this.userRepository.findByEmail(dto.email)
        if (emailUser != null) {
            return Pair(false, "email")
        }

        val usernameUser = this.userRepository.findByUsername(dto.username)
        if (usernameUser != null) {
            return Pair(false, "username")
        }

        return Pair(true, "")
    }

    /**
     * Encrypt password with BCrypt
     *
     * @see BCryptPasswordEncoder
     */
    fun encrypt(password: String): String {
        return this.encoder.encode(password)
    }

    /**
     * Find user with email.
     *
     * @return Target user. `null` if not found.
     */
    fun getUserByEmail(email: String): User? {
        return this.userRepository.findByEmail(email)
    }

    /**
     * Check if raw password and encrypted password are same.
     */
    fun matchPassword(rawPw: String, encrypted: String): Boolean {
        return this.encoder.matches(rawPw, encrypted)
    }

    fun getUserByUsername(username: String): User? {
        return this.userRepository.findByUsername(username)
    }

    fun getUserById(id: Long): User? {
        return this.userRepository.findByIdOrNull(id)
    }

    /**
     * Save profile image to local file system.
     * Acceptable types is `.png` and `.jpg`.
     * Uploaded file is stored in public folder of CDN server.
     */
    fun saveProfileImage(owner: Long, file: MultipartFile, ext: String): String {
        val path = arrayOf(
            System.getProperty("user.dir"),
            "..",
            "cdn",
            "public",
            "images",
            owner.toString()
        ).joinToString(File.separator)
        val targetPath = File(path)

        if (!targetPath.exists()) {
            targetPath.mkdirs()
        }

        if (file.isEmpty) {
            return ""
        }

        val target = File(targetPath, "profile${ext}")

        if (target.exists())
            target.delete()

        file.transferTo(target)

        return "/images/${owner}/profile${ext}"
    }

    /**
     * Delete profile image of target user
     *
     * @return Success
     */
    fun deleteProfileImage(user: Long, isJgp: Boolean): Boolean {
        val path = arrayOf(
            System.getProperty("user.dir"),
            "..",
            "cdn",
            "public",
            "images",
            user.toString(),
            "profile" + (if (isJgp) ".jpg" else ".png")
        ).joinToString(File.separator)
        val file = File(path)

        return if (!file.exists()) {
            false
        } else {
            file.delete()
        }
    }
}
