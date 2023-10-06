package io.yeahx4.jasao.role.file

enum class FileExtension(private val value: String) {
    PNG("IMAGE_PNG"),
    JPEG("IMAGE_JPEG"),
    OTHER("OTHER");

    fun toExtension(): String {
        return when (this) {
            JPEG -> ".jpg"
            PNG -> ".png"
            OTHER -> ""
        }
    }

    fun isImage(): Boolean {
        return this == JPEG || this == PNG
    }
}
