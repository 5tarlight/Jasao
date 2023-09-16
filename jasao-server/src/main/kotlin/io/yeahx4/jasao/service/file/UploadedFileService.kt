package io.yeahx4.jasao.service.file

import io.yeahx4.jasao.repository.file.UploadedFileRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File

/**
 * Service for file upload system.
 * Uploaded file except for profile image will be stored in
 * physical file system and DB table.
 *
 * @since 1.1.0
 */
@Service
class UploadedFileService(private val uploadedFileRepository: UploadedFileRepository) {
    /**
     * Save profile image to local file system.
     * Acceptable types is `.png` and `.jpg`.
     * Uploaded file is stored in public folder of CDN server.
     */
    fun saveProfileImage(owner: Long, file: MultipartFile): String {
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
