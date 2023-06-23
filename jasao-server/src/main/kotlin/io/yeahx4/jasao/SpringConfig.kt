package io.yeahx4.jasao

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Configuration
class SpringConfig {
    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()
}
