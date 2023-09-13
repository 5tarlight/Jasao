package io.yeahx4.jasao.util

import java.util.Optional

/**
 * Unwrap `Optional<T>` instance to `T?`.
 * This util is developed for supporting compatibility between Kotlin and Java.
 *
 * @since 1.0.0
 * @param optional instance of `Optional`
 * @return Nullable `T`
 * @see Optional
 */
fun <T> unwrap(optional: Optional<T>): T? {
    return if (optional.isPresent)
        optional.get()
    else
        null
}
