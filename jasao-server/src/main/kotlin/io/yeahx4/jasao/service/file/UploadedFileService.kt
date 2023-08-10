package io.yeahx4.jasao.service.file

import io.yeahx4.jasao.repository.file.UploadedFileRepository
import org.springframework.stereotype.Service

@Service
class UploadedFileService(private val uploadedFileRepository: UploadedFileRepository) {
}
