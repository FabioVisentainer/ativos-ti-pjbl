package br.pucpr.ativos.ativo

import br.pucpr.ativos.shared.ApiExceptionHandler
import br.pucpr.ativos.shared.ConflitoException
import br.pucpr.ativos.shared.RecursoNaoEncontradoException
import io.mockk.every
import io.mockk.mockk
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import java.math.BigDecimal
import java.time.LocalDate
import kotlin.test.Test

/** Teste da camada HTTP isolada (sem subir o Spring nem o banco): contrato JSON e códigos de status. */
class AtivoControllerTest {

    private val service = mockk<AtivoService>()
    private val mvc: MockMvc = MockMvcBuilders
        .standaloneSetup(AtivoController(service))
        .setControllerAdvice(ApiExceptionHandler())
        .build()

    private val resposta = AtivoResponse(
        id = 1,
        tipo = "Notebook",
        marca = "Dell",
        modelo = "Latitude 5440",
        numeroPatrimonio = "PAT-0001",
        numeroSerie = "8KJ2H31",
        status = "Em uso",
        colaborador = "Marina Alves",
        setor = "Financeiro",
        dataAquisicao = LocalDate.of(2023, 3, 14),
        valorAquisicao = BigDecimal("6890.00"),
    )

    @Test
    fun `GET api ativos devolve a lista no formato esperado pelo frontend`() {
        every { service.pesquisar(null, null) } returns listOf(resposta)

        mvc.perform(get("/api/ativos"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].numeroPatrimonio").value("PAT-0001"))
            .andExpect(jsonPath("$[0].status").value("Em uso"))
            .andExpect(jsonPath("$[0].colaborador").value("Marina Alves"))
    }

    @Test
    fun `GET repassa os filtros busca e status ao service`() {
        every { service.pesquisar("dell", "Em uso") } returns listOf(resposta)

        mvc.perform(get("/api/ativos").param("busca", "dell").param("status", "Em uso"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
    }

    @Test
    fun `POST devolve 201 com o ativo criado`() {
        every { service.criar(any()) } returns resposta

        mvc.perform(
            post("/api/ativos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"tipo":"Notebook","numeroPatrimonio":"PAT-0001"}"""),
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(1))
    }

    @Test
    fun `POST com patrimonio duplicado devolve 409 com o campo error`() {
        every { service.criar(any()) } throws ConflitoException("Já existe um ativo com o patrimônio PAT-0001.")

        mvc.perform(
            post("/api/ativos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"tipo":"Notebook","numeroPatrimonio":"PAT-0001"}"""),
        )
            .andExpect(status().isConflict)
            .andExpect(jsonPath("$.error").value("Já existe um ativo com o patrimônio PAT-0001."))
    }

    @Test
    fun `PUT em ativo inexistente devolve 404`() {
        every { service.alterar("PAT-0404", any()) } throws
            RecursoNaoEncontradoException("Nenhum ativo encontrado com o patrimônio PAT-0404.")

        mvc.perform(
            put("/api/ativos/PAT-0404")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"status":"Em uso"}"""),
        )
            .andExpect(status().isNotFound)
            .andExpect(jsonPath("$.error").exists())
    }

    @Test
    fun `DELETE devolve a mensagem de confirmacao`() {
        every { service.excluir("PAT-0001") } returns MensagemResponse("Ativo PAT-0001 excluído com sucesso.")

        mvc.perform(delete("/api/ativos/PAT-0001"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.mensagem").value("Ativo PAT-0001 excluído com sucesso."))
    }

    @Test
    fun `erro inesperado nao vaza detalhes internos`() {
        every { service.pesquisar(null, null) } throws IllegalStateException("senha do banco: 123")

        mvc.perform(get("/api/ativos"))
            .andExpect(status().isInternalServerError)
            .andExpect(jsonPath("$.error").value("Erro interno do servidor."))
    }
}
