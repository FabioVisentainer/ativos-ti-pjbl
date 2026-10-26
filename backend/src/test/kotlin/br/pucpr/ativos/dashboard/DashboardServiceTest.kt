package br.pucpr.ativos.dashboard

import br.pucpr.ativos.ativo.AtivoConsulta
import br.pucpr.ativos.ativo.AtivoPorSetor
import br.pucpr.ativos.ativo.StatusAtivo
import br.pucpr.ativos.manutencao.ManutencaoConsulta
import br.pucpr.ativos.movimentacao.MovimentacaoConsulta
import io.mockk.every
import io.mockk.mockk
import java.math.BigDecimal
import kotlin.test.Test
import kotlin.test.assertEquals

/** O Dashboard só conhece as PORTAS dos outros módulos: aqui elas são substituídas por mocks. */
class DashboardServiceTest {

    private val ativos = mockk<AtivoConsulta>()
    private val manutencoes = mockk<ManutencaoConsulta>()
    private val movimentacoes = mockk<MovimentacaoConsulta>()
    private val service = DashboardService(ativos, manutencoes, movimentacoes)

    @Test
    fun `consolida totais por status e soma o total de ativos`() {
        every { ativos.contarPorStatus() } returns mapOf(
            StatusAtivo.EM_USO to 7L,
            StatusAtivo.EM_ESTOQUE to 3L,
            StatusAtivo.BAIXADO to 1L,
        )
        every { ativos.contarPorSetor() } returns listOf(AtivoPorSetor("TI", 3))
        every { manutencoes.custoAcumulado() } returns BigDecimal("1000.00")
        every { manutencoes.custoPorMes() } returns emptyMap()
        every { movimentacoes.ultimas() } returns emptyList()

        val dashboard = service.obter()

        assertEquals(11L, dashboard.totalAtivos)
        assertEquals(7L, dashboard.emUso)
        assertEquals(3L, dashboard.emEstoque)
        assertEquals(0L, dashboard.emManutencao) // status ausente conta como zero
        assertEquals(1L, dashboard.baixados)
        assertEquals(BigDecimal("1000.00"), dashboard.custoManutencaoAcumulado)
        assertEquals(listOf(AtivoPorSetor("TI", 3)), dashboard.ativosPorSetor)
    }

    @Test
    fun `custo por mes mantem ordem cronologica e omite meses sem custo`() {
        every { ativos.contarPorStatus() } returns emptyMap()
        every { ativos.contarPorSetor() } returns emptyList()
        every { manutencoes.custoAcumulado() } returns BigDecimal.ZERO
        every { manutencoes.custoPorMes() } returns mapOf(
            8 to BigDecimal("225.00"),
            1 to BigDecimal("400.00"),
            5 to BigDecimal.ZERO,
        )
        every { movimentacoes.ultimas() } returns emptyList()

        val meses = service.obter().custoManutencaoPorMes

        assertEquals(listOf("Jan", "Ago"), meses.map { it.mes })
        assertEquals(BigDecimal("400.00"), meses.first().valor)
    }
}
