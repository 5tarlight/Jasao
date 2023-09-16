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

/**
 * User Community System
 *
 * # Features
 * - Follow & Unfollow
 * - Block
 */
@RestController
@RequestMapping("/users")
class UserCommunityController(
    private val followingService: FollowingService,
    private val jwtService: JwtService,
    private val userService: UserService,
    private val blockUserService: BlockUserService,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    /**
     * Follow user
     *
     * # Request
     * ### HTTP
     * POST `/users/auth/follow`
     *
     * ### Body
     * target: Long target user to follow
     *
     * # Response
     * - 400 : Target id is same to mine (self-follow)
     * - 400 : Already following
     * - 200 : Success
     */
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

    /**
     * Unfollow
     *
     * # Request
     * ### HTTP
     * POST `/users/auth/unfollow`
     *
     * ### Body
     * target: Long target user to unfollow
     *
     * # Response
     * - 200 : Ok
     */
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

    /**
     * Search users target is following
     *
     * # Request
     * ### HTTP
     * GET `/users/following`
     *
     * ### Param
     * - page: Int
     * - id : Long
     *
     * # Response
     * - 200 : Ok
     * ```json
     * {
     *      "page": int,
     *      "maxPage": int,
     *      "count": int number of all users
     *      "payload": [
     *          {
     *              "id": Long,
     *              "username": String,
     *              "profile": String?,
     *              "bio": String
     *          },
     *          ...
     *      ]
     * }
     * ```
     */
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

    /**
     * Search users following target user
     *
     * # Request
     * ### HTTP
     * GET `/users/followed`
     *
     * ### Param
     * - page: Int
     * - id : Long
     *
     * # Response
     * - 200 : Ok
     * ```json
     * {
     *      "page": int,
     *      "maxPage": int,
     *      "count": int number of all users
     *      "payload": [
     *          {
     *              "id": Long,
     *              "username": String,
     *              "profile": String?,
     *              "bio": String
     *          },
     *          ...
     *      ]
     * }
     * ```
     */
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

    /**
     * Check I'm following target user
     *
     * # Request
     * ### HTTP
     * GET `/users/auth/isfollow`
     *
     * ### Param
     * - target: Long
     *
     * # Response
     * Boolean
     */
    @GetMapping("/auth/isfollow")
    fun isFollowing(
        @RequestHeader("Authorization") jwt: String,
        @RequestParam target: Long
    ): Boolean {
        val me = this.jwtService.getUserFromToken(jwt)
        return this.followingService.isUserFollow(me.id, target)
    }

    /**
     * Block and unfollow target user
     *
     * # Request
     * ### HTTP
     * POST `/users/auth/block`
     *
     * ### Body
     * - target: Long
     *
     * # Response
     * - 200 : Success
     */
    @PostMapping("/auth/block")
    @Transactional
    fun blockUser(
        @RequestHeader("Authorization") jwt: String,
        @RequestBody blockDto: BlockDto
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)
        this.blockUserService.block(user.id, blockDto.target)
        this.followingService.unfollow(user.id, blockDto.target)

        this.logger.info("User ${user.id} blocks ${blockDto.target}")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }

    /**
     * Check if I've blocked target user
     *
     * # Request
     * ### HTTP
     * GET `/users/auth/isblocking`
     *
     * # param
     * target: Long
     *
     * # Response
     * - 200 : Success
     * ```json
     * {
     *      data: Boolean
     * }
     * ```
     */
    @GetMapping("/auth/isblocking")
    fun isBlocking(
        @RequestHeader("Authorization") jwt: String,
        @RequestParam target: Long
    ): Res<Boolean> {
        val user = this.jwtService.getUserFromToken(jwt)
        val isBlocking = this.blockUserService.isBlocking(user.id, target)

        return Res(HttpResponse("Ok", isBlocking), HttpStatus.OK)
    }

    /**
     * Unblock user
     *
     * # Request
     * ### HTTP
     * DELETE `/users/auth/unblock`
     *
     * ### Header
     * - Authorization: JWT
     *
     * ### Param
     * - target: Long
     *
     * # Response
     * - 200 : Success
     */
    @DeleteMapping("/auth/unblock")
    @Transactional
    fun unblock(
        @RequestHeader("Authorization") jwt: String,
        @RequestParam target: Long
    ): Res<String> {
        val user = this.jwtService.getUserFromToken(jwt)
        this.blockUserService.unblock(user.id, target)

        this.logger.info("User ${user.id} unblocks user $target")
        return Res(HttpResponse("Ok", null), HttpStatus.OK)
    }
}
