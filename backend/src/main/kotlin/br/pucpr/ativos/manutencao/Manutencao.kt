package br.pucpr.ativos.manutencao

import br.pucpr.ativos.ativo.Ativo
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

enum class TipoManutencao(val rotulo: String) {
    CORRETIVA("Corretiva"),
    PREVENTIVA("Preventiva"),
}

/** Registro de manutenção de um ativo, com seu custo (RF27–RF31). */
@Entity
@Table(name = "manutencao")
class Manutencao(
    @Column(name = "data", nullable = false)
    var data: LocalDate,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ativo_id", nullable = false)
    var ativo: Ativo,

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 12)
    var tipo: TipoManutencao,

    @Column(name = "descricao", nullable = false, length = 255)
    var descricao: String,

    @Column(name = "custo", nullable = false, precision = 10, scale = 2)
    var custo: BigDecimal,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
)
