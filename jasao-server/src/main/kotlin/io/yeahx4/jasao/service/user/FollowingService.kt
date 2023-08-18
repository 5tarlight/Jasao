package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.Following
import io.yeahx4.jasao.repository.user.FollowingRepository
import org.springframework.stereotype.Service

@Service
class FollowingService(private val followingService: FollowingRepository) {
    fun followUser(self: Long, target: Long) {
        this.followingService.save(Following("", self, target))
    }

    fun unfollow(self: Long, target: Long) {
        this.followingService.deleteByFollowerAndFollowed(self, target)
    }

    fun findByFollower(self: Long): List<Long> {
        return this.followingService.findAllByFollower(self)
            .map { it.followed }
    }

    fun findByFollowed(target: Long): List<Long> {
        return this.followingService.findAllByFollowed(target)
            .map { it.follower }
    }
}
