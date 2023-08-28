package io.yeahx4.jasao.repository.user

import io.yeahx4.jasao.entity.user.Following
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface FollowingRepository: JpaRepository<Following, String> {
    fun deleteByFollowerAndFollowed(follower: Long, followed: Long)
    @Deprecated("Possibly mass SQL query")
    fun findAllByFollower(follower: Long): List<Following>
    @Deprecated("Possibly mass SQL query")
    fun findAllByFollowed(followed: Long): List<Following>
    fun existsByFollowerAndFollowed(follower: Long, followed: Long): Boolean
    fun findByFollowerOrderByCreatedAtDesc(follower: Long, pageable: Pageable): Page<Following>
    fun findByFollowedOrderByCreatedAtDesc(followed: Long, pageable: Pageable): Page<Following>
    fun countByFollower(follower: Long): Int
    fun countByFollowed(followed: Long): Int
}
