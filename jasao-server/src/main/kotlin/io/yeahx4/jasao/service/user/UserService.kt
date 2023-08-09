package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.dto.user.SignUpDto
import io.yeahx4.jasao.entity.user.User
import io.yeahx4.jasao.repository.user.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File

@Service
class UserService(
    private val userRepository: UserRepository,
    private val encoder: BCryptPasswordEncoder
) {
    fun saveUser(user: User) {
        this.userRepository.save(user)
    }

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

    fun encrypt(password: String): String {
        return this.encoder.encode(password)
    }

    fun getUserByEmail(email: String): User? {
        return this.userRepository.findByEmail(email)
    }

    fun matchPassword(rawPw: String, encrypted: String): Boolean {
        return this.encoder.matches(rawPw, encrypted)
    }

    fun getUserByUsername(username: String): User? {
        return this.userRepository.findByUsername(username)
    }

    fun getUserById(id: Long): User? {
        return this.userRepository.findByIdOrNull(id)
    }

    fun savePicture(owner: Long, file: MultipartFile): String {
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

        val ext = if (file.contentType == "image/jpeg") {
            ".jpg"
        } else if (file.contentType == "image/png") {
            ".png"
        } else {
            return ""
        }

        val target = File(targetPath, "profile${ext}")
        file.transferTo(target)

        return target.path
    }
}
