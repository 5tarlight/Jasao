package io.yeahx4.jasao.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm.HS256
import jakarta.annotation.PostConstruct
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Component
import java.util.Base64
import java.util.Date

@Component
class JwtTokenProvider(private val userDetailsService: UserDetailsService) {
    private var secret = "xvljkzviuwaeffljhasdfljknasvlxcvpipupiu"
    private val validTime = 30 * 60 * 1000L

    // Encode secret with Base64 in constructor
    @PostConstruct
    protected fun init() {
        this.secret = Base64.getEncoder().encodeToString(secret.toByteArray())
    }

    fun createToken(userPk: String): String {
        val claims: Claims = Jwts.claims().setSubject(userPk)
        claims["userPk"] = userPk

        val now = Date()

        return Jwts
            .builder()
            .setHeaderParam("typ", "JWT")
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(Date(now.time + validTime))
            .signWith(HS256, secret)
            .compact()
    }

    fun getUserPk(token: String): String {
        return Jwts
            .parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .body
            .subject
    }

    fun getAuthentication(token: String): Authentication {
        val userDetails = userDetailsService.loadUserByUsername(getUserPk(token))
        return UsernamePasswordAuthenticationToken(userDetails, "", userDetails.authorities)
    }

    fun resolveToken(request: HttpServletRequest): String? {
        return request.getHeader("Authorization")
    }

    fun validateToken(jwtToken: String): Boolean {
        return try {
            val claims = Jwts
                .parser()
                .setSigningKey(secret)
                .parseClaimsJws(jwtToken)

            !claims.body.expiration.before(Date())
        } catch (e: Exception) {
            false
        }
    }
}
