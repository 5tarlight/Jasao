package io.yeahx4.jasao

import io.yeahx4.jasao.jwt.JwtAuthenticationFilter
import io.yeahx4.jasao.jwt.JwtTokenProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@EnableWebSecurity
@Configuration
class SecurityConfig(
    private val jwtTokenProvider: JwtTokenProvider,
): WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry
            .addMapping("/**")
//            .allowedOriginPatterns("http[s]{0,1}:\\/\\/(localhost)(:[0-9]{1,5}){0,1}")
            .allowedOrigins("http://localhost:3000")
            .allowCredentials(true)
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .httpBasic { it.disable() }
            .csrf { it.disable() }
            .addFilter(corsFilter())
            .sessionManagement {
                it.sessionCreationPolicy(STATELESS)
            }
            .authorizeHttpRequests {
                it
                    .requestMatchers("/user/auth/**").authenticated()
                    .requestMatchers("/cafe/auth/**").authenticated()
                    .requestMatchers("/file/auth/**").authenticated()
                    .requestMatchers("/users/auth/**").authenticated()
                    .requestMatchers("/**").permitAll()
            }
            .addFilterBefore(
                JwtAuthenticationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()

        val origins = listOf(
            "http://localhost:3000",
            "http://localhost",
            "https://localhost:3000",
            "https://localhost",
            "https://jasao.kro.kr:3000",
            "https://jasao.kro.kr",
            "https://ssky.kro.kr:3000",
            "https://ssky.kro.kr",
        )

        config.allowCredentials = true

        for (origin in origins) {
            config.addAllowedOrigin(origin)
        }

        config.addAllowedHeader("*")
        config.addAllowedMethod("*")

        source.registerCorsConfiguration("/**", config)

        return CorsFilter(source)
    }
}
