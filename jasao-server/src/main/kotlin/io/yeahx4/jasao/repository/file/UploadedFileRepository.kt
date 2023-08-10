package io.yeahx4.jasao.repository.file

import io.yeahx4.jasao.entity.file.UploadedFIle
import org.springframework.data.jpa.repository.JpaRepository

interface UploadedFileRepository: JpaRepository<UploadedFIle, String>
