package io.yeahx4.jasao.repository.user

import io.yeahx4.jasao.entity.user.Following
import org.springframework.data.jpa.repository.JpaRepository

interface FollowingRepository: JpaRepository<Following, String> {
    fun deleteByFollowerAndFollowed(follower: Long, followed: Long)
    fun findAllByFollower(follower: Long): List<Following>
    fun findAllByFollowed(followed: Long): List<Following>
    fun existsByFollowerAndFollowed(follower: Long, followed: Long): Boolean
}
