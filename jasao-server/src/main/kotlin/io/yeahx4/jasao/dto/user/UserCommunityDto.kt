package io.yeahx4.jasao.dto.user

import io.yeahx4.jasao.entity.user.User

data class FollowDto(
    val target: Long
)

data class FollowPageResDto(
    val id: Long,
    val username: String,
    val profile: String,
    val bio: String,
) {
    companion object {
        fun fromUser(user: User): FollowPageResDto {
            return FollowPageResDto(
                user.id,
                user.getRealUsername(),
                user.profile,
                user.bio
            )
        }
    }
}

data class FollowResDto(
    val page: Int,
    val maxPage: Int,
    val count: Int,
    val payload: List<FollowPageResDto>
)
