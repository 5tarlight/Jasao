package io.yeahx4.jasao.util

import java.util.Base64

fun encodeBase64(string: String): String {
    return String(Base64.getEncoder().encode(string.toByteArray()))
}

fun decodeBase64(string: String): String {
    return String(Base64.getDecoder().decode(string))
}

fun parsePayload(raw: String): Payload {
    return Payload(decodeBase64(raw))
}

fun encodePayload(payload: Payload): String {
    return encodeBase64(payload.toString())
}
