package br.pucpr.ativos.colaborador

import br.pucpr.ativos.shared.SituacaoPessoa

/** Resposta da API (tipo "Colaborador" em frontend/lib/types.ts). */
data class ColaboradorResponse(
    val id: Long,
    val nome: String,
    val matricula: String,
    val setor: String,
    val situacao: String,
    val ativosAlocados: Long,
)

/** Projeção de leitura: colaborador + quantidade de ativos sob sua responsabilidade. */
interface ColaboradorComTotal {
    val id: Long
    val nome: String
    val matricula: String
    val setor: String
    val situacao: SituacaoPessoa
    val ativosAlocados: Long
}

fun ColaboradorComTotal.toResponse(): ColaboradorResponse =
    ColaboradorResponse(
        id = id,
        nome = nome,
        matricula = matricula,
        setor = setor,
        situacao = situacao.rotulo,
        ativosAlocados = ativosAlocados,
    )
