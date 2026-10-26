package br.pucpr.ativos.shared

import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

/**
 * Tratamento centralizado de erros (SRP): os Controllers e Services apenas lançam exceções de
 * domínio; a tradução para HTTP acontece aqui. Detalhes internos nunca são devolvidos ao cliente.
 */
@RestControllerAdvice
class ApiExceptionHandler {

    private val log = LoggerFactory.getLogger(ApiExceptionHandler::class.java)

    @ExceptionHandler(RecursoNaoEncontradoException::class)
    fun naoEncontrado(e: RecursoNaoEncontradoException): ResponseEntity<ApiError> =
        resposta(HttpStatus.NOT_FOUND, e.message)

    @ExceptionHandler(ConflitoException::class)
    fun conflito(e: ConflitoException): ResponseEntity<ApiError> =
        resposta(HttpStatus.CONFLICT, e.message)

    @ExceptionHandler(RegraDeNegocioException::class)
    fun regraDeNegocio(e: RegraDeNegocioException): ResponseEntity<ApiError> =
        resposta(HttpStatus.BAD_REQUEST, e.message)

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun corpoInvalido(e: HttpMessageNotReadableException): ResponseEntity<ApiError> {
        log.debug("Corpo da requisição ilegível", e)
        return resposta(HttpStatus.BAD_REQUEST, "Corpo da requisição inválido.")
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun parametroInvalido(e: MethodArgumentTypeMismatchException): ResponseEntity<ApiError> =
        resposta(HttpStatus.BAD_REQUEST, "Parâmetro '${e.name}' inválido.")

    @ExceptionHandler(DataIntegrityViolationException::class)
    fun integridade(e: DataIntegrityViolationException): ResponseEntity<ApiError> {
        log.warn("Violação de integridade de dados", e)
        return resposta(HttpStatus.CONFLICT, "A operação viola a integridade dos dados (registro duplicado ou em uso).")
    }

    @ExceptionHandler(RuntimeException::class)
    fun inesperado(e: RuntimeException): ResponseEntity<ApiError> {
        log.error("Erro inesperado", e)
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor.")
    }

    private fun resposta(status: HttpStatus, mensagem: String?): ResponseEntity<ApiError> =
        ResponseEntity.status(status).body(ApiError(mensagem ?: status.reasonPhrase))
}
