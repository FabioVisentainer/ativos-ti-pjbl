package br.pucpr.ativos.shared

/** Situação cadastral de colaboradores e usuários (kernel compartilhado entre módulos). */
enum class SituacaoPessoa(val rotulo: String) {
    ATIVO("Ativo"),
    INATIVO("Inativo"),
}
