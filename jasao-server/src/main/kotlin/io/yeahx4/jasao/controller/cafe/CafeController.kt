package io.yeahx4.jasao.controller.cafe

import io.yeahx4.jasao.dto.cafe.CreateCafeDto
import io.yeahx4.jasao.dto.cafe.UpdateCafeDto
import io.yeahx4.jasao.entity.cafe.Cafe
import io.yeahx4.jasao.service.user.JwtService
import io.yeahx4.jasao.service.user.UserService
import io.yeahx4.jasao.service.cafe.CafeService
import io.yeahx4.jasao.service.cafe.CafeSettingService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.Res
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/cafe")
class CafeController(
    private val cafeService: CafeService,
    private val jwtService: JwtService,
    private val userService: UserService,
    private val cafeSettingService: CafeSettingService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/auth/create")
    fun createCafe(
        @RequestHeader("Authorization") token: String,
        @RequestBody dto: CreateCafeDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(token)

        val cafe = this.cafeService.getCafeByIdentifier(dto.identifier)

        if (cafe != null) {
            this.logger.warn(
                "Cafe creation attempt failed: Taken identifier(${dto.identifier}) by ${user.getRealUsername()}(${user.id})"
            )
            return Res(HttpResponse("Taken identifier", null), HttpStatus.BAD_REQUEST)
        }

        val dbCafe = this.cafeService.create(dto, user.id)

        this.logger.info(
            "New cafe created: ${dto.name} identified ${dto.identifier} by user ${user.getRealUsername()}(${user.id})"
        )

        this.cafeSettingService.createDefault(dbCafe.id)

        this.logger.info("Setting of cafe ${dbCafe.name}(${dbCafe.id}) initiated.")

        return Res(HttpResponse("Success", null), HttpStatus.CREATED)
    }

    @GetMapping("/{identifier}")
    fun getCafe(@PathVariable("identifier") identifier: String): Res<Cafe> {
        val cafe = this.cafeService.getCafeByIdentifier(identifier)

        return if (cafe == null) {
            this.logger.info("Failed get cafe request: Unable to find cafe $identifier")
            Res(HttpResponse("Not Found", null), HttpStatus.NOT_FOUND)
        } else {
            this.logger.info("Successful get cafe request: $identifier")
            Res(HttpResponse("Ok", cafe), HttpStatus.OK)
        }
    }

    @GetMapping("/owner/{owner}")
    fun getOwnerCafe(@PathVariable("owner") owner: Long): Res<List<Cafe>> {
        val user = this.userService.getUserById(owner)

        if (user == null) {
            this.logger.info("Failed cafe list request by owner id: Unknown user $owner")
            return Res(HttpResponse("Unknown User", null), HttpStatus.NOT_FOUND)
        }

        val cafes = this.cafeService.getAllCafeByOwner(owner)
        this.logger.info("Successful cafe list request by owner id: $owner")
        return Res(HttpResponse("Ok", cafes), HttpStatus.OK)
    }

    @Transactional
    @PatchMapping("/auth/update")
    fun updateCafe(
        @RequestHeader("Authorization") token: String,
        @RequestBody dto: UpdateCafeDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(token)
        val cafe = this.cafeService.getCafeById(dto.cafe)

        if (cafe == null) {
            this.logger.info(
                "Failed cafe update request by user ${user.id}: Unable to find cafe ${dto.cafe}"
            )
            return Res(HttpResponse("Cafe Not Found", null), HttpStatus.NOT_FOUND)
        }

        if (!this.cafeService.isOwner(cafe, user)) {
            this.logger.warn(
                "Failed cafe update request by user ${user.id}: Not owner of ${dto.cafe}"
            )
            return Res(HttpResponse("Permission denied", null), HttpStatus.FORBIDDEN)
        }

        if (!this.userService.matchPassword(dto.oldPassword, user.password)) {
            this.logger.warn("Failed cafe update request by user ${user.id}: Password mismatch")
            return Res(HttpResponse("Password mismatch", null), HttpStatus.FORBIDDEN)
        }

        if (dto.name != null) {
            cafe.name = dto.name
        }

        if (dto.description != null) {
            cafe.description = dto.description
        }

        this.logger.info("Successfully cafe ${cafe.id} updated by user ${user.id}")
        return Res(HttpResponse("Success", null), HttpStatus.OK)
    }

    @GetMapping("/setting")
    fun getCafeSetting(@RequestParam cafe: Long) {

    }
}
