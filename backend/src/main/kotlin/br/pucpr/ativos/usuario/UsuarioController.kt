package br.pucpr.ativos.usuario

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/usuarios")
class UsuarioController(private val service: UsuarioService) {

    @GetMapping
    fun listar(): List<UsuarioResponse> = service.listar()
}
