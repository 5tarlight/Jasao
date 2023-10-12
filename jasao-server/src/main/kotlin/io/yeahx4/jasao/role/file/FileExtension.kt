package io.yeahx4.jasao.role.file

enum class FileExtension(private val value: String) {
    PNG("IMAGE_PNG"),
    JPEG("IMAGE_JPEG"),
    OTHER("OTHER");

    override fun toString(): String {
        return when (this) {
            JPEG -> ".jpg"
            PNG -> ".png"
            OTHER -> ".unknown"
        }
    }

    fun isImage(): Boolean {
        return this == JPEG || this == PNG
    }
}
