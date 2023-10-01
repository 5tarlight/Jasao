package io.yeahx4.jasao.entity.file

import io.yeahx4.jasao.entity.TimeEntity
import io.yeahx4.jasao.role.file.FileExtension
import io.yeahx4.jasao.role.file.UploadedFileRole
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class UploadedFile(
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String,

    @Column(nullable = false)
    val owner: Long,

    @Column(nullable = false)
    var path: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val role: UploadedFileRole,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var extension: FileExtension,

    @Column(nullable = false)
    val payload: String,
): TimeEntity()
