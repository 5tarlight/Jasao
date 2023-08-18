package io.yeahx4.jasao.controller.user

import io.yeahx4.jasao.dto.user.FollowDto
import io.yeahx4.jasao.service.user.FollowingService
import io.yeahx4.jasao.service.user.JwtService
import io.yeahx4.jasao.service.user.UserService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.Res
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserCommunityController(
    private val followingService: FollowingService,
    private val jwtService: JwtService,
    private val userService: UserService
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/auth/follow")
    fun follow(
        @RequestHeader("Authorization") jwt: String,
        @RequestBody dto: FollowDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)
        val target = this.userService.getUserById(dto.target)
            ?: return Res(HttpResponse("Invalid user", null), HttpStatus.NOT_FOUND)

        if (user.id == dto.target) {
            return Res(HttpResponse("Self follow is prohibited", null), HttpStatus.BAD_REQUEST)
        }
        if (this.followingService.isUserFollow(user.id, dto.target)) {
            return Res(HttpResponse("Already following", null), HttpStatus.BAD_REQUEST)
        }

        this.followingService.followUser(user.id, dto.target)

        this.logger.info("User ${user.id} starts to follow user ${target.id}")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }

    @PostMapping("/auth/unfollow")
    @Transactional
    fun unfollow(
        @RequestHeader("Authorization") jwt: String,
        @RequestBody dto: FollowDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)

        this.logger.info("User ${user.id} unfollows user ${dto.target}")

        this.followingService.unfollow(user.id, dto.target)

        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }

    @GetMapping("/following")
    fun getFollowing(@RequestParam id: Long): Res<List<Long>> {
        return Res(
            HttpResponse("Ok", this.followingService.findByFollower(id)),
            HttpStatus.OK
        )
    }

    @GetMapping("/followed")
    fun getFollowed(@RequestParam id: Long): Res<List<Long>> {
        return Res(
            HttpResponse("Ok", this.followingService.findByFollowed(id)),
            HttpStatus.OK
        )
    }
}