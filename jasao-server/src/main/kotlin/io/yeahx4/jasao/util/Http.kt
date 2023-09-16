package io.yeahx4.jasao.util

import org.springframework.http.ResponseEntity

/**
 * Utility for consistent HTTP response format.
 * `HttpResponse` data class will be converted into HTTP response body
 * in JSON format like below:
 * ```json
 * {
 *      "message": "OK",
 *      "data": {
 *          "username": "Jasao",
 *          ...
 *      }
 * }
 * ```
 *
 * This util is designed to use with `ResponseEntity`.
 * When use this util with `ResponseEntity`, consider `Res`.
 *
 * @since 1.0.0
 * @see Res
 * @see ResponseEntity
 * @param T Type of payload
 * @param data payload of HTTP response
 * @param message Message of HTTP response. Generally, coupled with HTTP code.
 */
data class HttpResponse<T>(
    val message: String,
    val data: T?
)

/**
 * Http Response data class without payload.
 *
 * @see HttpResponse
 * @since 1.0.0
 */
data class MessageHttpResponse(
    val message: String
)

/**
 * Alias of `ResponseEntity<HttpResponse<T>>`
 *
 * @since 1.0
 * @see HttpResponse
 * @see ResponseEntity
 */
typealias Res<T> = ResponseEntity<HttpResponse<T>>

/**
 * Alias of `ResponseEntity<MessageHttpResponse>>`
 *
 * @since 1.0
 * @see MessageHttpResponse
 * @see ResponseEntity
 */
typealias MsgRes = ResponseEntity<MessageHttpResponse>
