package br.pucpr.ativos.movimentacao

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/movimentacoes")
class MovimentacaoController(private val service: MovimentacaoService) {

    @GetMapping
    fun listarRecentes(): List<MovimentacaoResponse> = service.ultimas()
}
