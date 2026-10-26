package br.pucpr.ativos.dashboard

import br.pucpr.ativos.ativo.AtivoConsulta
import br.pucpr.ativos.ativo.StatusAtivo
import br.pucpr.ativos.manutencao.ManutencaoConsulta
import br.pucpr.ativos.movimentacao.MovimentacaoConsulta
import org.springframework.stereotype.Service

/**
 * Caso de uso de agregação (RF35). Não tem entidade nem repositório próprios: depende apenas das
 * PORTAS de leitura dos outros módulos (interfaces), nunca das implementações (DIP).
 */
@Service
class DashboardService(
    private val ativos: AtivoConsulta,
    private val manutencoes: ManutencaoConsulta,
    private val movimentacoes: MovimentacaoConsulta,
) {

    fun obter(): DashboardResponse {
        val porStatus = ativos.contarPorStatus()
        val custoPorMes = manutencoes.custoPorMes()

        fun total(status: StatusAtivo): Long = porStatus[status] ?: 0L

        return DashboardResponse(
            totalAtivos = porStatus.values.sum(),
            emUso = total(StatusAtivo.EM_USO),
            emEstoque = total(StatusAtivo.EM_ESTOQUE),
            emManutencao = total(StatusAtivo.EM_MANUTENCAO),
            baixados = total(StatusAtivo.BAIXADO),
            custoManutencaoAcumulado = manutencoes.custoAcumulado(),
            ativosPorSetor = ativos.contarPorSetor(),
            // Só os meses que tiveram manutenção, em ordem cronológica (Jan..Dez).
            custoManutencaoPorMes = MESES.mapIndexedNotNull { indice, nome ->
                custoPorMes[indice + 1]
                    ?.takeIf { it.signum() > 0 }
                    ?.let { CustoPorMes(nome, it) }
            },
            ultimasMovimentacoes = movimentacoes.ultimas(),
        )
    }

    private companion object {
        val MESES = listOf("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez")
    }
}
