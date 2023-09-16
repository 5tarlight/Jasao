package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.dto.user.FollowPageResDto
import io.yeahx4.jasao.dto.user.FollowResDto
import io.yeahx4.jasao.entity.user.Following
import io.yeahx4.jasao.repository.user.FollowingRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

/**
 * Service for follow and unfollow system.
 *
 * @since 1.1.0
 */
@Service
class FollowingService(
    private val followingRepository: FollowingRepository,
    private val userService: UserService
) {
    /**
     * Follow user.
     *
     * @param self My account
     * @param target Target user id to follow
     */
    fun followUser(self: Long, target: Long) {
        this.followingRepository.save(Following("", self, target))
    }

    /**
     * Unfollow user.
     *
     * @param self My account
     * @param target Target user id to unfollow
     */
    fun unfollow(self: Long, target: Long) {
        this.followingRepository.deleteByFollowerAndFollowed(self, target)
    }

    /**
     * Find who are following target user.
     * Result is page.
     *
     * @param self target user
     */
    fun findByFollower(self: Long, pageable: Pageable): FollowResDto {
        val page = this.followingRepository.findByFollowerOrderByCreatedAtDesc(self, pageable)
        val list = page
            .map { it.followed }
            .mapNotNull { userService.getUserById(it) }
            .map { FollowPageResDto.fromUser(it) }
        val count = this.followingRepository.countByFollower(self)

        return FollowResDto(
            page.number,
            page.totalPages,
            count,
            list
        )
    }

    /**
     * Find who target user is following.
     * Result is page.
     *
     * @param target user
     */
    fun findByFollowed(target: Long, pageable: Pageable): FollowResDto {
        val page = this.followingRepository.findByFollowedOrderByCreatedAtDesc(target, pageable)
        val list = page
            .map { it.follower }
            .mapNotNull { userService.getUserById(it) }
            .map { FollowPageResDto.fromUser(it) }
        val count = this.followingRepository.countByFollowed(target)

        return FollowResDto(
            page.number,
            page.totalPages,
            count,
            list
        )
    }

    /**
     * Check if user is following target user
     */
    fun isUserFollow(self: Long, target: Long): Boolean {
        return this.followingRepository.existsByFollowerAndFollowed(self, target)
    }
}
