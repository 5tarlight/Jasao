package io.yeahx4.jasao.util

/**
 * Validate given string has a form of email.
 * The RegExp used to validate needs to be updated.
 *
 * @since 1.0.0
 * @param str String to be examined.
 * @return Whether given string is email
 * @see Regex
 */
fun isEmail(str: String): Boolean {
    // TODO : Update RegExp or introduce validator
    val regexp = Regex("^[\\w]+@([\\w-.]+.)+[\\w]{2,4}\$")
    return regexp.matches(str)
}
