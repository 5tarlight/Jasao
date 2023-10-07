package io.yeahx4.jasao.repository.file

import io.yeahx4.jasao.entity.file.UploadedFile
import io.yeahx4.jasao.role.file.UploadedFileRole
import org.springframework.data.jpa.repository.JpaRepository

interface UploadedFileRepository: JpaRepository<UploadedFile, String> {
    fun deleteByOwner(owner: Long)
    fun findByOwnerAndRole(owner: Long, role: UploadedFileRole): UploadedFile?
    fun findByPayloadAndRole(payload: String, role: UploadedFileRole): UploadedFile?
}
