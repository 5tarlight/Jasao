package io.yeahx4.jasao

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.PropertySource

@SpringBootApplication
@PropertySource("classpath:/jasao.properties")
class JasaoServerApplication

fun main(args: Array<String>) {
    runApplication<JasaoServerApplication>(*args)
}
