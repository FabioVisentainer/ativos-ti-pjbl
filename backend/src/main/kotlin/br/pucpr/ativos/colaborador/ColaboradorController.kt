package br.pucpr.ativos.colaborador

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/colaboradores")
class ColaboradorController(private val service: ColaboradorService) {

    @GetMapping
    fun listar(): List<ColaboradorResponse> = service.listar()
}
