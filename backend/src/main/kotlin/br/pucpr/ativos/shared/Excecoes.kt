package br.pucpr.ativos.shared

/** Recurso solicitado não existe (HTTP 404). */
class RecursoNaoEncontradoException(message: String) : RuntimeException(message)

/** A operação conflita com o estado atual dos dados (HTTP 409). */
class ConflitoException(message: String) : RuntimeException(message)

/** Dados inválidos ou regra de negócio violada (HTTP 400). */
class RegraDeNegocioException(message: String) : RuntimeException(message)
