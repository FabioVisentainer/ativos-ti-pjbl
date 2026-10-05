package br.pucpr.ativos.ativo

import java.math.BigDecimal
import java.time.LocalDate

/** Resposta da API para um ativo (mesmo formato do tipo "Ativo" em frontend/lib/types.ts). */
data class AtivoResponse(
    val id: Long,
    val tipo: String,
    val marca: String,
    val modelo: String,
    val numeroPatrimonio: String,
    val numeroSerie: String,
    val status: String,
    val colaborador: String?,
    val setor: String?,
    val dataAquisicao: LocalDate,
    val valorAquisicao: BigDecimal,
)

/** Corpo do POST /api/ativos. Todos os campos são opcionais no JSON; as regras ficam no domínio. */
data class NovoAtivoRequest(
    val tipo: String? = null,
    val marca: String? = null,
    val modelo: String? = null,
    val numeroPatrimonio: String? = null,
    val numeroSerie: String? = null,
    val status: String? = null,
    val colaborador: String? = null,
    val setor: String? = null,
    val dataAquisicao: LocalDate? = null,
    val valorAquisicao: BigDecimal? = null,
)

/** Resposta simples de confirmação (DELETE). */
data class MensagemResponse(val mensagem: String)

/** Quantidade de ativos por setor (usado no dashboard). */
data class AtivoPorSetor(val setor: String, val quantidade: Long)

/** Projeções de leitura usadas pelo AtivoRepository (consultas agregadas). */
interface StatusTotal {
    val status: StatusAtivo
    val total: Long
}

interface SetorTotal {
    val setor: String
    val quantidade: Long
}

fun Ativo.toResponse(): AtivoResponse =
    AtivoResponse(
        id = requireNotNull(id) { "Ativo ainda não persistido" },
        tipo = tipo,
        marca = marca,
        modelo = modelo,
        numeroPatrimonio = numeroPatrimonio,
        numeroSerie = numeroSerie,
        status = status.rotulo,
        colaborador = colaborador?.nome,
        setor = setor,
        dataAquisicao = dataAquisicao,
        valorAquisicao = valorAquisicao,
    )
