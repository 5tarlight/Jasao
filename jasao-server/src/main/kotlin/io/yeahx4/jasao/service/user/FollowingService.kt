package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.dto.user.FollowPageResDto
import io.yeahx4.jasao.entity.user.Following
import io.yeahx4.jasao.entity.user.User
import io.yeahx4.jasao.repository.user.FollowingRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class FollowingService(
    private val followingService: FollowingRepository,
    private val userService: UserService
) {
    fun followUser(self: Long, target: Long) {
        this.followingService.save(Following("", self, target))
    }

    fun unfollow(self: Long, target: Long) {
        this.followingService.deleteByFollowerAndFollowed(self, target)
    }

    fun findByFollower(self: Long, pageable: Pageable): List<FollowPageResDto> {
        return this.followingService.findByFollowerOrderByCreatedAtDesc(self, pageable)
            .map { it.followed }
            .mapNotNull { userService.getUserById(it) }
            .map { FollowPageResDto.fromUser(it) }
    }

    fun findByFollowed(target: Long, pageable: Pageable): List<FollowPageResDto> {
        return this.followingService.findByFollowedOrderByCreatedAtDesc(target, pageable)
            .map { it.follower }
            .mapNotNull { userService.getUserById(it) }
            .map { FollowPageResDto.fromUser(it) }
    }

    fun isUserFollow(self: Long, target: Long): Boolean {
        return this.followingService.existsByFollowerAndFollowed(self, target)
    }
}
