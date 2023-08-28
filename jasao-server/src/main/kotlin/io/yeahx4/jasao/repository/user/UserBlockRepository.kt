package io.yeahx4.jasao.repository.user

import io.yeahx4.jasao.entity.user.UserBlock
import org.springframework.data.jpa.repository.JpaRepository

interface UserBlockRepository: JpaRepository<UserBlock, String> {
    fun existsByOperatorAndTarget(operator: Long, target: Long): Boolean
    fun deleteByOperatorAndTarget(operator: Long, target: Long);
}
