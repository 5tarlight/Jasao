package io.yeahx4.jasao.service.file

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File

/**
 * This service is not for controllers.
 */
@Service
class LocalFileService {
    companion object {
        val userDir: String = System.getProperty("user.dir")
    }

    fun saveFile(rawPath: List<String>, file: MultipartFile, filename: String): String {
        val path = arrayOf(
            userDir,
            "..",
            "cdn",
            "public",
            "images",
            rawPath.joinToString(File.separator)
        ).joinToString(File.separator)
        val targetPath = File(path)

        if (!targetPath.exists()) {
            targetPath.mkdirs()
        }

        if (file.isEmpty) {
            return ""
        }

        val target = File(targetPath, filename)

        if (target.exists())
            target.delete()

        file.transferTo(target)

        return "/images/${rawPath.joinToString(File.separator)}/${filename}"
    }

    fun deleteFile(rawPath: List<String>, filename: String): Boolean {
        val path = arrayOf(
            userDir,
            "..",
            "cdn",
            "public",
            "images",
            rawPath.joinToString(File.separator),
            filename
        ).joinToString(File.separator)
        val file = File(path)

        return if (file.exists()) {
            file.delete()
        } else {
            false
        }
    }
}
