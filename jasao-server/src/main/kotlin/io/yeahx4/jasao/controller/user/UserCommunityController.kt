package io.yeahx4.jasao.controller.user

import io.yeahx4.jasao.dto.user.BlockDto
import io.yeahx4.jasao.dto.user.FollowDto
import io.yeahx4.jasao.dto.user.FollowResDto
import io.yeahx4.jasao.service.user.BlockUserService
import io.yeahx4.jasao.service.user.FollowingService
import io.yeahx4.jasao.service.user.JwtService
import io.yeahx4.jasao.service.user.UserService
import io.yeahx4.jasao.util.HttpResponse
import io.yeahx4.jasao.util.Res
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
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
    private val userService: UserService,
    private val blockUserService: BlockUserService,
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
    fun getFollowing(
        @RequestParam id: Long,
        @PageableDefault(
            size = 10,
            page = 0
        )
        pageable: Pageable
    ): Res<FollowResDto> {
        return Res(
            HttpResponse("Ok", this.followingService.findByFollower(id, pageable)),
            HttpStatus.OK
        )
    }

    @GetMapping("/followed")
    fun getFollowed(
        @RequestParam id: Long,
        @PageableDefault(
            size = 10,
            page = 0
        )
        pageable: Pageable
    ): Res<FollowResDto> {
        return Res(
            HttpResponse("Ok", this.followingService.findByFollowed(id, pageable)),
            HttpStatus.OK
        )
    }

    @GetMapping("/auth/isfollow")
    fun isFollowing(
        @RequestHeader("Authorization") jwt: String,
        @RequestParam target: Long
    ): Boolean {
        val me = this.jwtService.getUserFromToken(jwt);
        return this.followingService.isUserFollow(me.id, target);
    }

    @PostMapping("/auth/block")
    fun blockUser(
        @RequestHeader("Authorization") jwt: String,
        @RequestBody blockDto: BlockDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)
        this.blockUserService.block(user.id, blockDto.target)

        this.logger.info("User ${user.id} blocks ${blockDto.target}")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }

    @GetMapping("/auth/isblocking")
    fun isBlocking(
        @RequestHeader("Authorization") jwt: String,
        @RequestParam target: Long
    ): Res<Boolean> {
        val user = this.jwtService.getUserFromToken(jwt)
        val isBlocking = this.blockUserService.isBlocking(user.id, target)

        return Res(HttpResponse("Ok", isBlocking), HttpStatus.OK)
    }

    @DeleteMapping("/auth/unblock")
    fun unblock(
        @RequestHeader("Authorization") jwt: String,
        @RequestBody unblockDto: BlockDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)
        this.blockUserService.unblock(user.id, unblockDto.target)

        this.logger.info("User ${user.id} unblocks user ${unblockDto.target}")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }
}
