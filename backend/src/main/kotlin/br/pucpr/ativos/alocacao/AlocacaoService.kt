package br.pucpr.ativos.alocacao

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AlocacaoService(private val repository: AlocacaoRepository) {

    @Transactional(readOnly = true)
    fun listar(): List<AlocacaoResponse> =
        repository.listarComDetalhes().map { it.toResponse() }
}
