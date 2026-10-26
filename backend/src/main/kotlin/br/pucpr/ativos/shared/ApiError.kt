package br.pucpr.ativos.shared

/** Corpo padrão de erro: o frontend lê o campo "error" (ver frontend/lib/api.ts). */
data class ApiError(val error: String)
