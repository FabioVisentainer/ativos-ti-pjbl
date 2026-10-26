package br.pucpr.ativos.ativo

import br.pucpr.ativos.colaborador.ColaboradorConsulta
import br.pucpr.ativos.shared.ConflitoException
import br.pucpr.ativos.shared.RecursoNaoEncontradoException
import br.pucpr.ativos.shared.RegraDeNegocioException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDate
import java.time.format.DateTimeParseException

/**
 * Porta de leitura do módulo "ativo" para OUTROS módulos (ex.: dashboard).
 * Quem consome depende desta interface (DIP) e nunca do AtivoRepository ou da entidade.
 */
interface AtivoConsulta {
    fun contarPorStatus(): Map<StatusAtivo, Long>

    fun contarPorSetor(): List<AtivoPorSetor>
}

@Service
class AtivoService(
    private val repository: AtivoRepository,
    private val colaboradores: ColaboradorConsulta,
) : AtivoConsulta {

    @Transactional(readOnly = true)
    fun pesquisar(busca: String?, status: String?): List<AtivoResponse> {
        val statusFiltro: Collection<StatusAtivo> =
            if (status.isNullOrBlank() || status == STATUS_TODOS) {
                StatusAtivo.entries
            } else {
                // Status desconhecido não encontra nada (mesmo comportamento do mock anterior).
                listOfNotNull(StatusAtivo.doRotulo(status)).ifEmpty { return emptyList() }
            }
        val padrao = "%" + (busca ?: "").trim().lowercase() + "%"
        return repository.pesquisar(padrao, statusFiltro).map { it.toResponse() }
    }

    @Transactional
    fun criar(request: NovoAtivoRequest): AtivoResponse {
        val ativo = Ativo(
            tipo = request.tipo?.trim().orEmpty(),
            marca = request.marca?.trim().orEmpty(),
            modelo = request.modelo?.trim().orEmpty(),
            numeroPatrimonio = request.numeroPatrimonio?.trim().orEmpty(),
            numeroSerie = request.numeroSerie?.trim().orEmpty(),
            status = StatusAtivo.doRotulo(request.status) ?: StatusAtivo.EM_ESTOQUE,
            colaborador = request.colaborador?.takeIf { it.isNotBlank() }?.let(colaboradores::exigirPorNome),
            setor = request.setor?.takeIf { it.isNotBlank() },
            dataAquisicao = request.dataAquisicao ?: LocalDate.now(),
            valorAquisicao = request.valorAquisicao ?: BigDecimal.ZERO,
        )

        if (repository.existsByNumeroPatrimonio(ativo.numeroPatrimonio)) {
            throw ConflitoException("Já existe um ativo com o patrimônio ${ativo.numeroPatrimonio}.")
        }
        return repository.save(ativo).toResponse()
    }

    /** Atualização parcial: só os campos presentes no JSON são alterados ("colaborador": null desvincula). */
    @Transactional
    fun alterar(numeroPatrimonio: String, campos: Map<String, Any?>): AtivoResponse {
        if (campos.containsKey("status") && StatusAtivo.doRotulo(campos["status"] as? String) == null) {
            throw RegraDeNegocioException("status inválido. Use um de: ${StatusAtivo.rotulosValidos()}.")
        }
        val editaveis = campos.filterKeys { it in CAMPOS_EDITAVEIS }
        if (editaveis.isEmpty()) {
            throw RegraDeNegocioException("Nenhum campo válido para atualizar foi enviado.")
        }

        val ativo = buscarOuFalhar(numeroPatrimonio)
        editaveis.forEach { (campo, valor) -> aplicar(ativo, campo, valor) }
        return ativo.toResponse() // entidade gerenciada: o Hibernate grava as mudanças ao fim da transação
    }

    @Transactional
    fun excluir(numeroPatrimonio: String): MensagemResponse {
        val ativo = buscarOuFalhar(numeroPatrimonio)
        try {
            repository.delete(ativo)
            repository.flush()
        } catch (e: DataIntegrityViolationException) {
            throw ConflitoException(
                "O ativo $numeroPatrimonio possui manutenções, alocações ou movimentações registradas e não pode ser excluído.",
            )
        }
        return MensagemResponse("Ativo $numeroPatrimonio excluído com sucesso.")
    }

    @Transactional(readOnly = true)
    override fun contarPorStatus(): Map<StatusAtivo, Long> =
        repository.totaisPorStatus().associate { it.status to it.total }

    @Transactional(readOnly = true)
    override fun contarPorSetor(): List<AtivoPorSetor> =
        repository.totaisPorSetor()
            .map { AtivoPorSetor(it.setor, it.quantidade) }
            .sortedWith(compareByDescending<AtivoPorSetor> { it.quantidade }.thenBy { it.setor })

    private fun buscarOuFalhar(numeroPatrimonio: String): Ativo =
        repository.buscarPorNumeroPatrimonio(numeroPatrimonio)
            ?: throw RecursoNaoEncontradoException("Nenhum ativo encontrado com o patrimônio $numeroPatrimonio.")

    private fun aplicar(ativo: Ativo, campo: String, valor: Any?) {
        when (campo) {
            "tipo" -> ativo.tipo = valor?.toString()?.trim().orEmpty()
                .ifBlank { throw RegraDeNegocioException("O campo tipo não pode ficar vazio.") }
            "marca" -> ativo.marca = valor?.toString()?.trim().orEmpty()
            "modelo" -> ativo.modelo = valor?.toString()?.trim().orEmpty()
            "numeroSerie" -> ativo.numeroSerie = valor?.toString()?.trim().orEmpty()
            "status" -> ativo.status = checkNotNull(StatusAtivo.doRotulo(valor as? String))
            "colaborador" -> ativo.colaborador =
                (valor as? String)?.takeIf { it.isNotBlank() }?.let(colaboradores::exigirPorNome)
            "setor" -> ativo.setor = (valor as? String)?.takeIf { it.isNotBlank() }
            "dataAquisicao" -> ativo.dataAquisicao = lerData(valor)
            "valorAquisicao" -> ativo.valorAquisicao = lerValor(valor)
        }
    }

    private fun lerData(valor: Any?): LocalDate =
        try {
            LocalDate.parse(valor.toString())
        } catch (e: DateTimeParseException) {
            throw RegraDeNegocioException("dataAquisicao inválida. Use o formato AAAA-MM-DD.")
        }

    private fun lerValor(valor: Any?): BigDecimal =
        valor?.toString()?.toBigDecimalOrNull()
            ?: throw RegraDeNegocioException("valorAquisicao inválido.")

    private companion object {
        const val STATUS_TODOS = "Todos"
        val CAMPOS_EDITAVEIS = setOf(
            "tipo", "marca", "modelo", "numeroSerie", "status",
            "colaborador", "setor", "dataAquisicao", "valorAquisicao",
        )
    }
}
