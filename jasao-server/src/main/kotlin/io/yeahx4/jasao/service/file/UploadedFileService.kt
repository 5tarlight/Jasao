package io.yeahx4.jasao.service.file

import io.yeahx4.jasao.entity.file.UploadedFile
import io.yeahx4.jasao.repository.file.UploadedFileRepository
import io.yeahx4.jasao.role.file.FileExtension
import io.yeahx4.jasao.role.file.UploadedFileRole
import io.yeahx4.jasao.util.Payload
import io.yeahx4.jasao.util.encodeBase64
import org.springframework.stereotype.Service

/**
 * Service for file upload system.
 *
 * @since 1.1.0
 */
@Service
class UploadedFileService(private val uploadedFileRepository: UploadedFileRepository) {
    fun saveProfileImage(user: Long, ext: String, path: String) {
        this.uploadedFileRepository.save(
            UploadedFile(
                "",
                user,
                path,
                UploadedFileRole.PROFILE,
                if (ext == ".png") FileExtension.PNG else FileExtension.JPEG,
                encodeBase64("role=${Payload.PROFILE_IMAGE}")
            )
        )
    }

    fun deleteProfileImage(user: Long) {
        this.uploadedFileRepository.deleteByOwner(user)
    }

    @Deprecated("You can infer if profile eixsts through profile field of user")
    fun isProfileExists(user: Long): Boolean {
        return this.uploadedFileRepository.findByOwner(user) != null
    }

    fun getProfileImageByOwner(user: Long): UploadedFile? {
        return this.uploadedFileRepository.findByOwner(user)
    }

    fun saveCafeIcon(cafe: String, ext: String, user: Long, path: String) {
        this.uploadedFileRepository.save(
            UploadedFile(
                "",
                user,
                "/images/cafe/${user}/profile${ext}",
                UploadedFileRole.CAFE_ICON,
                if (ext == ".png") FileExtension.PNG else FileExtension.JPEG,
                encodeBase64("role=${Payload.cafeIcon(cafe)}")
            )
        )
    }
}
