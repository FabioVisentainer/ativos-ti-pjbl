package br.pucpr.ativos.manutencao

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/manutencoes")
class ManutencaoController(private val service: ManutencaoService) {

    @GetMapping
    fun listar(): List<ManutencaoResponse> = service.listar()
}
