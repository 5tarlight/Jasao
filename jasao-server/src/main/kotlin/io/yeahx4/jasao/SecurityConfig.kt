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

/**
 * Spring configuration specialized in security.
 * This class configs CORS, `allowCredentials`, and JWT filter chain.
 *
 * # JWT Filter
 * Jasao uses JWT to authorize users.
 * Before each controller or other services, JWT filter chain takes token and
 * validate JWT with due date, DB table validation.
 */
@EnableWebSecurity
@Configuration
class SecurityConfig(
    private val jwtTokenProvider: JwtTokenProvider,
): WebMvcConfigurer {
    /**
     * Configure cors mappings.
     * This method is overriding of `WebMvcConfigurer`.
     * Configuring CORS by overriding `WebMvcConfigurer` is changed by Spring update.
     * This method is shadowed by `corsFilter`.
     *
     * @see WebMvcConfigurer
     * @see corsFilter
     */
    @Deprecated("Extending WebMvcConfigurer and overriding is not recommended")
    override fun addCorsMappings(registry: CorsRegistry) {
        registry
            .addMapping("/**")
//            .allowedOriginPatterns("http[s]{0,1}:\\/\\/(localhost)(:[0-9]{1,5}){0,1}")
            .allowedOrigins("http://localhost:3000")
            .allowCredentials(true)
    }

    /**
     * Configs filter chain for JWT.
     * Disables `httpBasic` and `csrf` provided by Spring Security.
     * Since Jasao uses JWT to authenticate user, disable session by set `sessionCreationPolicy`
     * to `STATELESS`.
     *
     * To enable automatic JWT validation, target endpoint should be enrolled to below list.
     * Conventionally, in Jasao, using `/feature/auth/` endpoint to enable authentication.
     *
     * Every request which does not fit authentication policy will be rejected with
     * "403 Forbidden" code.
     *
     * Authentication policy of JWT is due date validation, DB table validation and
     * refresh token DB match validation which is implemented by Jasao team.
     */
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

    /**
     * Configs CORS policy.
     */
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()

        // TODO : Extract lists. Not hard-coded.
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
