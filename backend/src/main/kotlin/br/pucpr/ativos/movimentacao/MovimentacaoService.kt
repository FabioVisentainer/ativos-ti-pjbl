package br.pucpr.ativos.movimentacao

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** Porta de leitura do módulo "movimentacao" para outros módulos (ex.: dashboard). */
interface MovimentacaoConsulta {
    fun ultimas(): List<MovimentacaoResponse>
}

@Service
class MovimentacaoService(private val repository: MovimentacaoRepository) : MovimentacaoConsulta {

    @Transactional(readOnly = true)
    override fun ultimas(): List<MovimentacaoResponse> =
        repository.findTop10ByOrderByDataDescIdDesc().map { it.toResponse() }
}
