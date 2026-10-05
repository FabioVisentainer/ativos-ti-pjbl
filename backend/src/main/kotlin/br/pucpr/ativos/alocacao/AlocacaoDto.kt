package br.pucpr.ativos.alocacao

import java.time.LocalDate

/** Resposta da API (tipo "Alocacao" em frontend/lib/types.ts). */
data class AlocacaoResponse(
    val id: Long,
    val numeroPatrimonio: String,
    val equipamento: String,
    val colaborador: String,
    val setor: String,
    val dataRetirada: LocalDate,
)

fun Alocacao.toResponse(): AlocacaoResponse =
    AlocacaoResponse(
        id = requireNotNull(id) { "Alocação ainda não persistida" },
        numeroPatrimonio = ativo.numeroPatrimonio,
        equipamento = ativo.equipamento(),
        colaborador = colaborador.nome,
        setor = colaborador.setor,
        dataRetirada = dataRetirada,
    )
