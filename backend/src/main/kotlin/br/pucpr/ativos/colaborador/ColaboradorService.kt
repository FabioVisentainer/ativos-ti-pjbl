package br.pucpr.ativos.colaborador

import br.pucpr.ativos.shared.RegraDeNegocioException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** Porta de leitura do módulo "colaborador" para outros módulos (ex.: ativo). */
interface ColaboradorConsulta {
    /** Devolve o colaborador pelo nome ou lança [RegraDeNegocioException] se não existir. */
    fun exigirPorNome(nome: String): Colaborador
}

@Service
class ColaboradorService(
    private val repository: ColaboradorRepository,
) : ColaboradorConsulta {

    @Transactional(readOnly = true)
    fun listar(): List<ColaboradorResponse> =
        repository.listarComTotalDeAtivos().map { it.toResponse() }

    @Transactional(readOnly = true)
    override fun exigirPorNome(nome: String): Colaborador =
        repository.findFirstByNomeIgnoreCase(nome.trim())
            ?: throw RegraDeNegocioException("Colaborador '${nome.trim()}' não encontrado.")
}
