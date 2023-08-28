package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.UserBlock
import io.yeahx4.jasao.repository.user.UserBlockRepository
import org.springframework.stereotype.Service

@Service
class BlockUserService(private val userBlockRepository: UserBlockRepository) {
    fun block(op: Long, target: Long) {
        this.userBlockRepository.save(UserBlock("", op, target))
    }

    fun isBlocking(op: Long, target: Long): Boolean {
        return this.userBlockRepository.existsByOperatorAndTarget(op, target)
    }

    fun unblock(op: Long, target: Long) {
        this.userBlockRepository.deleteByOperatorAndTarget(op, target)
    }
}
