package br.pucpr.ativos.ativo

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

/** Camada HTTP do módulo "ativo": só converte a requisição e delega ao Service. */
@RestController
@RequestMapping("/api/ativos")
class AtivoController(private val service: AtivoService) {

    @GetMapping
    fun pesquisar(
        @RequestParam("busca", required = false) busca: String?,
        @RequestParam("status", required = false) status: String?,
    ): List<AtivoResponse> = service.pesquisar(busca, status)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun inserir(@RequestBody(required = false) request: NovoAtivoRequest?): AtivoResponse =
        service.criar(request ?: NovoAtivoRequest())

    @PutMapping("/{numeroPatrimonio}")
    fun alterar(
        @PathVariable("numeroPatrimonio") numeroPatrimonio: String,
        @RequestBody(required = false) campos: Map<String, Any?>?,
    ): AtivoResponse = service.alterar(numeroPatrimonio, campos ?: emptyMap())

    @DeleteMapping("/{numeroPatrimonio}")
    fun excluir(@PathVariable("numeroPatrimonio") numeroPatrimonio: String): MensagemResponse =
        service.excluir(numeroPatrimonio)
}
