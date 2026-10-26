package br.pucpr.ativos.movimentacao

import br.pucpr.ativos.ativo.Ativo
import br.pucpr.ativos.colaborador.Colaborador
import br.pucpr.ativos.usuario.Usuario
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDate

/** Histórico de operações sobre ativos (alocação, devolução, envio para manutenção, baixa…). */
@Entity
@Table(name = "movimentacao")
class Movimentacao(
    @Column(name = "data", nullable = false)
    var data: LocalDate,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ativo_id", nullable = false)
    var ativo: Ativo,

    @Column(name = "operacao", nullable = false, length = 60)
    var operacao: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colaborador_id")
    var colaborador: Colaborador?,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registrado_por_id", nullable = false)
    var registradoPor: Usuario,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
)
