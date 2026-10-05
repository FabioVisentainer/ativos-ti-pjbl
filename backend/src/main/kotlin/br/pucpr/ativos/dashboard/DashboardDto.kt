package br.pucpr.ativos.dashboard

import br.pucpr.ativos.ativo.AtivoPorSetor
import br.pucpr.ativos.movimentacao.MovimentacaoResponse
import java.math.BigDecimal

data class CustoPorMes(val mes: String, val valor: BigDecimal)

/** Resposta da API (tipo "DashboardData" em frontend/lib/types.ts). */
data class DashboardResponse(
    val totalAtivos: Long,
    val emUso: Long,
    val emEstoque: Long,
    val emManutencao: Long,
    val baixados: Long,
    val custoManutencaoAcumulado: BigDecimal,
    val ativosPorSetor: List<AtivoPorSetor>,
    val custoManutencaoPorMes: List<CustoPorMes>,
    val ultimasMovimentacoes: List<MovimentacaoResponse>,
)
