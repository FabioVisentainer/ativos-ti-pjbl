package br.pucpr.ativos.alocacao

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/alocacoes")
class AlocacaoController(private val service: AlocacaoService) {

    @GetMapping
    fun listar(): List<AlocacaoResponse> = service.listar()
}
