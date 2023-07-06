package io.yeahx4.jasao.controller.cafe

import io.yeahx4.jasao.dto.cafe.CreateCafeDto
import io.yeahx4.jasao.service.auth.JwtService
import io.yeahx4.jasao.service.cafe.CafeService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.Res
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
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
        this.cafeService.create(dto, user.id)

        this.logger.info(
            "New cafe created: ${dto.name} identified ${dto.identifier} by user ${user.username}(${user.id})"
        )

        return Res(HttpResponse("Success", null), HttpStatus.CREATED)
    }
}
