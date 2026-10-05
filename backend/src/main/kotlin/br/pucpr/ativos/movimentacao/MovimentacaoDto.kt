package br.pucpr.ativos.movimentacao

import java.time.LocalDate

/** Resposta da API (tipo "Movimentacao" em frontend/lib/types.ts). */
data class MovimentacaoResponse(
    val id: Long,
    val data: LocalDate,
    val numeroPatrimonio: String,
    val ativo: String,
    val operacao: String,
    val colaborador: String?,
    val registradoPor: String,
)

fun Movimentacao.toResponse(): MovimentacaoResponse =
    MovimentacaoResponse(
        id = requireNotNull(id) { "Movimentação ainda não persistida" },
        data = data,
        numeroPatrimonio = ativo.numeroPatrimonio,
        ativo = ativo.equipamento(),
        operacao = operacao,
        colaborador = colaborador?.nome,
        registradoPor = registradoPor.nome,
    )
