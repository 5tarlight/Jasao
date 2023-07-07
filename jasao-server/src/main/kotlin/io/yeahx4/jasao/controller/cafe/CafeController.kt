package io.yeahx4.jasao.controller.cafe

import io.yeahx4.jasao.dto.cafe.CreateCafeDto
import io.yeahx4.jasao.entity.cafe.Cafe
import io.yeahx4.jasao.service.auth.JwtService
import io.yeahx4.jasao.service.cafe.CafeService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.Res
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/cafe")
class CafeController(
    private val cafeService: CafeService,
    private val jwtService: JwtService
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
            this.logger.info(
                "Cafe creation attempt failed: Taken identifier(${dto.identifier}) by ${user.getRealUsername()}(${user.id})"
            )
            return Res(HttpResponse("Taken identifier", null), HttpStatus.BAD_REQUEST)
        }

        this.cafeService.create(dto, user.id)

        this.logger.info(
            "New cafe created: ${dto.name} identified ${dto.identifier} by user ${user.getRealUsername()}(${user.id})"
        )

        return Res(HttpResponse("Success", null), HttpStatus.CREATED)
    }

    @GetMapping("/{identifier}")
    fun getCafe(@PathVariable("identifier") identifier: String): Res<Cafe> {
        val cafe = this.cafeService.getCafeByIdentifier(identifier)

        return if (cafe == null) {
            Res(HttpResponse("Not Found", null), HttpStatus.NOT_FOUND)
        } else {
            Res(HttpResponse("Ok", cafe), HttpStatus.OK)
        }
    }
}
