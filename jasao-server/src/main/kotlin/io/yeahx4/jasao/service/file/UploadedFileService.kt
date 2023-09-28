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

}
