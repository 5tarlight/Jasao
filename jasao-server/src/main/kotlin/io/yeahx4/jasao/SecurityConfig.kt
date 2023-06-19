package io.yeahx4.jasao

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@EnableWebSecurity
@Configuration
class SecurityConfig: WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry
            .addMapping("/**")
            .allowedOriginPatterns("http[s]{0,1}:\\/\\/(localhost)(:[0-9]{1,5}){0,1}")
    }
}
