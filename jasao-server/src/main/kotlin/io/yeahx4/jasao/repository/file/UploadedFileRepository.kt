package io.yeahx4.jasao.repository.file

import io.yeahx4.jasao.entity.file.UploadedFile
import org.springframework.data.jpa.repository.JpaRepository

interface UploadedFileRepository: JpaRepository<UploadedFile, String> {
    fun deleteByOwner(owner: Long)
    fun findByOwner(owner: Long): UploadedFile?
}
