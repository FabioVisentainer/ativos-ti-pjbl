package br.pucpr.ativos.manutencao

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

/** Porta de leitura do módulo "manutencao" para outros módulos (ex.: dashboard). */
interface ManutencaoConsulta {
    fun custoAcumulado(): BigDecimal

    /** Custo somado por número do mês (1 = janeiro … 12 = dezembro), sem separar por ano. */
    fun custoPorMes(): Map<Int, BigDecimal>
}

@Service
class ManutencaoService(private val repository: ManutencaoRepository) : ManutencaoConsulta {

    @Transactional(readOnly = true)
    fun listar(): List<ManutencaoResponse> =
        repository.listarComAtivo().map { it.toResponse() }

    @Transactional(readOnly = true)
    override fun custoAcumulado(): BigDecimal =
        repository.findAll().fold(BigDecimal.ZERO) { total, m -> total + m.custo }

    @Transactional(readOnly = true)
    override fun custoPorMes(): Map<Int, BigDecimal> =
        repository.findAll()
            .groupBy { it.data.monthValue }
            .mapValues { (_, itens) -> itens.fold(BigDecimal.ZERO) { total, m -> total + m.custo } }
}
