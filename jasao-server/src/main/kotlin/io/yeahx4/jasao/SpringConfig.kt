package io.yeahx4.jasao

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

/**
 * Main configuration of Spring project.
 * Configure Spring Beans.
 */
@Configuration
class SpringConfig {
    /**
     * Spring Been used to encrypt password of user database.
     *
     * @see BCryptPasswordEncoder
     */
    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()
}
