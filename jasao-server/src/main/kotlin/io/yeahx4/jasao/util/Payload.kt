package io.yeahx4.jasao.util

import org.slf4j.LoggerFactory

class Payload(raw: String) {
    private val map: MutableMap<String, String> = mutableMapOf()
    private val logger = LoggerFactory.getLogger(this::class.java)

    companion object {
        const val PROFILE_IMAGE = "profile-image"

        fun cafeIcon(identifier: String): String {
            return "cafe-icon:${identifier}"
        }
    }

    init {
        try {
            raw.split("&").map {
                val kv = it.split("=")
                Pair(kv[0], kv[1])
            }.forEach {
                map[it.first] = it.second
            }
        } catch (ex: IndexOutOfBoundsException) {
            map.clear()
            logger.warn("Invalid payload parsing detected.\nContent: $raw")
        }
    }

    fun getKey(key: String): String? {
        return if (map.containsKey(key))
            map[key]
        else
            null
    }

    fun containsKey(key: String): Boolean {
        return map.containsKey(key)
    }

    fun setPair(key: String, value: String) {
        map[key] = value
    }

    override fun toString(): String {
        return this.map.map {
            "${it.key}=${it.value}"
        }.joinToString("&")
    }
}
