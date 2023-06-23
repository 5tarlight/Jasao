package io.yeahx4.jasao.util

import org.springframework.http.ResponseEntity

data class HttpResponse<T>(
    val message: String,
    val data: T?
)

data class MessageHttpResponse(
    val message: String
)

typealias Res<T> = ResponseEntity<HttpResponse<T>>
typealias MsgRes = ResponseEntity<MessageHttpResponse>
