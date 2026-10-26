package br.pucpr.ativos.gateway

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * API Gateway: ponto único de entrada para o frontend.
 * As rotas e o CORS ficam declarados em application.yml (nenhuma regra de negócio aqui).
 */
@SpringBootApplication
class GatewayApplication

fun main(args: Array<String>) {
    runApplication<GatewayApplication>(*args)
}
