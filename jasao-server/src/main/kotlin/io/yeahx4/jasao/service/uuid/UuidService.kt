package io.yeahx4.jasao.service.uuid

import org.springframework.stereotype.Service
import java.util.UUID

/**
 * Service for creating random UUID.
 *
 * @see UUID
 * @since 1.0.0
 */
@Service
class UuidService {
    /**
     * Create a random UUID.
     *
     * @see UUID
     */
    fun createUuid(): String {
        return UUID.randomUUID().toString()
    }
}
