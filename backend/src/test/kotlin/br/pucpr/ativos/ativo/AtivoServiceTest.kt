package br.pucpr.ativos.ativo

import br.pucpr.ativos.colaborador.ColaboradorConsulta
import br.pucpr.ativos.shared.ConflitoException
import br.pucpr.ativos.shared.RecursoNaoEncontradoException
import br.pucpr.ativos.shared.RegraDeNegocioException
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.springframework.dao.DataIntegrityViolationException
import java.math.BigDecimal
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

/** Testes unitários do caso de uso: Repository e módulo vizinho são substituídos por mocks (DIP). */
class AtivoServiceTest {

    private val repository = mockk<AtivoRepository>()
    private val colaboradores = mockk<ColaboradorConsulta>()
    private val service = AtivoService(repository, colaboradores)

    private fun ativoPersistido(
        patrimonio: String = "PAT-0001",
        status: StatusAtivo = StatusAtivo.EM_ESTOQUE,
    ) = Ativo(
        tipo = "Notebook",
        marca = "Dell",
        modelo = "Latitude 5440",
        numeroPatrimonio = patrimonio,
        numeroSerie = "8KJ2H31",
        status = status,
        colaborador = null,
        setor = null,
        dataAquisicao = LocalDate.of(2023, 3, 14),
        valorAquisicao = BigDecimal("6890.00"),
        id = 1L,
    )

    @Test
    fun `criar sem numero de patrimonio lanca regra de negocio`() {
        assertFailsWith<RegraDeNegocioException> {
            service.criar(NovoAtivoRequest(tipo = "Notebook"))
        }
    }

    @Test
    fun `criar com patrimonio ja existente lanca conflito`() {
        every { repository.existsByNumeroPatrimonio("PAT-0001") } returns true

        assertFailsWith<ConflitoException> {
            service.criar(NovoAtivoRequest(tipo = "Notebook", numeroPatrimonio = "PAT-0001"))
        }
        verify(exactly = 0) { repository.save(any<Ativo>()) }
    }

    @Test
    fun `criar com status invalido assume Em estoque`() {
        every { repository.existsByNumeroPatrimonio("PAT-0099") } returns false
        every { repository.save(any<Ativo>()) } answers {
            val a = firstArg<Ativo>()
            Ativo(
                a.tipo, a.marca, a.modelo, a.numeroPatrimonio, a.numeroSerie, a.status,
                a.colaborador, a.setor, a.dataAquisicao, a.valorAquisicao, id = 7L,
            )
        }

        val resposta = service.criar(
            NovoAtivoRequest(tipo = "Monitor", numeroPatrimonio = "PAT-0099", status = "qualquer coisa"),
        )

        assertEquals(7L, resposta.id)
        assertEquals("Em estoque", resposta.status)
        assertEquals(BigDecimal.ZERO, resposta.valorAquisicao)
    }

    @Test
    fun `alterar com status invalido lanca regra de negocio sem consultar o banco`() {
        assertFailsWith<RegraDeNegocioException> {
            service.alterar("PAT-0001", mapOf("status" to "Quebrado"))
        }
        verify(exactly = 0) { repository.buscarPorNumeroPatrimonio(any()) }
    }

    @Test
    fun `alterar sem campos editaveis lanca regra de negocio`() {
        assertFailsWith<RegraDeNegocioException> {
            service.alterar("PAT-0001", mapOf("numeroPatrimonio" to "PAT-9999"))
        }
    }

    @Test
    fun `alterar ativo inexistente lanca nao encontrado`() {
        every { repository.buscarPorNumeroPatrimonio("PAT-0404") } returns null

        assertFailsWith<RecursoNaoEncontradoException> {
            service.alterar("PAT-0404", mapOf("setor" to "TI"))
        }
    }

    @Test
    fun `alterar atualiza somente os campos enviados`() {
        every { repository.buscarPorNumeroPatrimonio("PAT-0001") } returns ativoPersistido()

        val resposta = service.alterar(
            "PAT-0001",
            mapOf("status" to "Em uso", "valorAquisicao" to 7000.5, "setor" to "Financeiro"),
        )

        assertEquals("Em uso", resposta.status)
        assertEquals(BigDecimal("7000.5"), resposta.valorAquisicao)
        assertEquals("Financeiro", resposta.setor)
        assertEquals("Dell", resposta.marca) // não enviado: permanece igual
    }

    @Test
    fun `alterar com colaborador nulo desvincula o ativo`() {
        every { repository.buscarPorNumeroPatrimonio("PAT-0001") } returns ativoPersistido()

        val resposta = service.alterar("PAT-0001", mapOf("colaborador" to null))

        assertEquals(null, resposta.colaborador)
    }

    @Test
    fun `excluir ativo inexistente lanca nao encontrado`() {
        every { repository.buscarPorNumeroPatrimonio("PAT-0404") } returns null

        assertFailsWith<RecursoNaoEncontradoException> { service.excluir("PAT-0404") }
    }

    @Test
    fun `excluir ativo com historico lanca conflito`() {
        val ativo = ativoPersistido()
        every { repository.buscarPorNumeroPatrimonio("PAT-0001") } returns ativo
        every { repository.delete(ativo) } just Runs
        every { repository.flush() } throws DataIntegrityViolationException("fk")

        assertFailsWith<ConflitoException> { service.excluir("PAT-0001") }
    }

    @Test
    fun `excluir ativo existente devolve mensagem de sucesso`() {
        val ativo = ativoPersistido()
        every { repository.buscarPorNumeroPatrimonio("PAT-0001") } returns ativo
        every { repository.delete(ativo) } just Runs
        every { repository.flush() } just Runs

        assertTrue(service.excluir("PAT-0001").mensagem.contains("PAT-0001"))
    }

    @Test
    fun `pesquisar com status desconhecido nao consulta o banco`() {
        val resultado = service.pesquisar(busca = null, status = "Inexistente")

        assertTrue(resultado.isEmpty())
        verify(exactly = 0) { repository.pesquisar(any(), any()) }
    }

    @Test
    fun `pesquisar monta o padrao em minusculas com curingas`() {
        val padrao = slot<String>()
        every { repository.pesquisar(capture(padrao), any()) } returns listOf(ativoPersistido())

        val resultado = service.pesquisar(busca = "  DELL ", status = "Todos")

        assertEquals("%dell%", padrao.captured)
        assertEquals(1, resultado.size)
    }
}
