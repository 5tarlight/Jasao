package io.yeahx4.jasao.service.user

import io.yeahx4.jasao.entity.user.UserBlock
import io.yeahx4.jasao.repository.user.UserBlockRepository
import org.springframework.stereotype.Service

/**
 * Service for block system.
 */
@Service
class BlockUserService(private val userBlockRepository: UserBlockRepository) {
    /**
     * Block target user
     */
    fun block(op: Long, target: Long) {
        this.userBlockRepository.save(UserBlock("", op, target))
    }

    /**
     * Check if user has blocked target user
     */
    fun isBlocking(op: Long, target: Long): Boolean {
        return this.userBlockRepository.existsByOperatorAndTarget(op, target)
    }

    /**
     * Unblock(pardon) target user
     */
    fun unblock(op: Long, target: Long) {
        this.userBlockRepository.deleteByOperatorAndTarget(op, target)
    }
}
