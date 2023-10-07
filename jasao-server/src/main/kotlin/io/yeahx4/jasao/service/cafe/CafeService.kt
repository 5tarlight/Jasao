package io.yeahx4.jasao.service.cafe

import io.yeahx4.jasao.dto.cafe.CreateCafeDto
import io.yeahx4.jasao.entity.user.User
import io.yeahx4.jasao.entity.cafe.Cafe
import io.yeahx4.jasao.repository.cafe.CafeRepository
import io.yeahx4.jasao.service.file.LocalFileService
import io.yeahx4.jasao.util.unwrap
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class CafeService(
    private val cafeRepository: CafeRepository,
    private val localFileService: LocalFileService
) {
    fun create(dto: CreateCafeDto, owner: Long): Cafe {
        return cafeRepository.save(Cafe(
            -1,
            dto.identifier,
            dto.name,
            dto.description ?: "",
            owner,
            null,
        ))
    }

    fun getCafeByIdentifier(identifier: String): Cafe? {
        return this.cafeRepository.findByIdentifier(identifier)
    }

    fun getAllCafeByOwner(owner: Long): List<Cafe> {
        return this.cafeRepository.findAllByOwner(owner)
    }

    fun isOwner(cafe: Cafe, user: User): Boolean {
        return cafe.owner == user.id
    }

    fun getCafeById(id: Long): Cafe? {
        return unwrap(this.cafeRepository.findById(id))
    }

    fun saveCafeIcon(identifier: String, file: MultipartFile, ext: String): String {
        return this.localFileService.saveFile(
            listOf("cafe", identifier),
            file,
            "icon${ext}"
        )
    }
}
