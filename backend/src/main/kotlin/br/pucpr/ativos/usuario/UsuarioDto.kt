package br.pucpr.ativos.usuario

import java.time.LocalDateTime

/** Resposta da API (tipo "Usuario" em frontend/lib/types.ts). */
data class UsuarioResponse(
    val id: Long,
    val nome: String,
    val contaCorporativa: String,
    val perfil: String,
    val ultimoAcesso: LocalDateTime?,
    val situacao: String,
)

fun Usuario.toResponse(): UsuarioResponse =
    UsuarioResponse(
        id = requireNotNull(id) { "Usuário ainda não persistido" },
        nome = nome,
        contaCorporativa = contaCorporativa,
        perfil = perfil.rotulo,
        ultimoAcesso = ultimoAcesso,
        situacao = situacao.rotulo,
    )
