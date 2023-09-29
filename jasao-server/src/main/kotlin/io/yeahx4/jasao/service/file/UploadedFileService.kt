package io.yeahx4.jasao.service.file

import io.yeahx4.jasao.entity.file.UploadedFile
import io.yeahx4.jasao.repository.file.UploadedFileRepository
import io.yeahx4.jasao.role.file.FileExtension
import io.yeahx4.jasao.role.file.UploadedFileRole
import org.springframework.stereotype.Service

/**
 * Service for file upload system.
 *
 * @since 1.1.0
 */
@Service
class UploadedFileService(private val uploadedFileRepository: UploadedFileRepository) {
    fun saveProfileImage(user: Long, ext: String) {
        this.uploadedFileRepository.save(
            UploadedFile(
                "",
                user,
                "/images/${user}/profile${ext}",
                UploadedFileRole.PROFILE,
                if (ext == ".png") FileExtension.PNG else FileExtension.JPEG
            )
        );
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
}
