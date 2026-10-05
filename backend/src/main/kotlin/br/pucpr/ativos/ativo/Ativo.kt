package br.pucpr.ativos.ativo

import br.pucpr.ativos.colaborador.Colaborador
import br.pucpr.ativos.shared.RegraDeNegocioException
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDate

/** Situação de um ativo. O rótulo é o texto trocado com o frontend (contrato da API). */
enum class StatusAtivo(val rotulo: String) {
    EM_ESTOQUE("Em estoque"),
    EM_USO("Em uso"),
    EM_MANUTENCAO("Em manutenção"),
    BAIXADO("Baixado"),
    ;

    companion object {
        fun doRotulo(rotulo: String?): StatusAtivo? = entries.firstOrNull { it.rotulo == rotulo }

        fun rotulosValidos(): String = entries.joinToString(", ") { it.rotulo }
    }
}

/** Entidade de domínio: ativo de TI (notebook, monitor, impressora...). */
@Entity
@Table(name = "ativo")
class Ativo(
    @Column(name = "tipo", nullable = false, length = 60)
    var tipo: String,

    @Column(name = "marca", nullable = false, length = 80)
    var marca: String,

    @Column(name = "modelo", nullable = false, length = 120)
    var modelo: String,

    /** Identifica o ativo para o negócio; não pode ser alterado depois de criado. */
    @Column(name = "numero_patrimonio", nullable = false, unique = true, updatable = false, length = 30)
    val numeroPatrimonio: String,

    @Column(name = "numero_serie", nullable = false, length = 60)
    var numeroSerie: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    var status: StatusAtivo,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colaborador_id")
    var colaborador: Colaborador?,

    @Column(name = "setor", length = 60)
    var setor: String?,

    @Column(name = "data_aquisicao", nullable = false)
    var dataAquisicao: LocalDate,

    @Column(name = "valor_aquisicao", nullable = false, precision = 12, scale = 2)
    var valorAquisicao: BigDecimal,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
) {
    init {
        // Invariante do domínio: um ativo sempre tem tipo e número de patrimônio.
        if (tipo.isBlank() || numeroPatrimonio.isBlank()) {
            throw RegraDeNegocioException("Campos obrigatórios: numeroPatrimonio, tipo.")
        }
    }

    /** Descrição amigável usada em listagens ("Dell Latitude 5440"). */
    fun equipamento(): String = "$marca $modelo".trim()
}
