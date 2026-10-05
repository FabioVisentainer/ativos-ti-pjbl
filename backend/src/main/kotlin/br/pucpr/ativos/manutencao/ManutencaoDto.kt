package br.pucpr.ativos.manutencao

import java.math.BigDecimal
import java.time.LocalDate

/** Resposta da API (tipo "Manutencao" em frontend/lib/types.ts). */
data class ManutencaoResponse(
    val id: Long,
    val data: LocalDate,
    val numeroPatrimonio: String,
    val equipamento: String,
    val tipo: String,
    val descricao: String,
    val custo: BigDecimal,
)

fun Manutencao.toResponse(): ManutencaoResponse =
    ManutencaoResponse(
        id = requireNotNull(id) { "Manutenção ainda não persistida" },
        data = data,
        numeroPatrimonio = ativo.numeroPatrimonio,
        equipamento = ativo.equipamento(),
        tipo = tipo.rotulo,
        descricao = descricao,
        custo = custo,
    )
