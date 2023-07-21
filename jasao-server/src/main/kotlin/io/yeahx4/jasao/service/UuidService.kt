package io.yeahx4.jasao.service

import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UuidService {
    fun createUuid(): String {
        return UUID.randomUUID().toString()
    }
}
