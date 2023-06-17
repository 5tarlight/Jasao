package io.yeahx4.jasao.util

fun isEmail(str: String): Boolean {
    val regexp = Regex("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}\$")
    return regexp.matches(str)
}
