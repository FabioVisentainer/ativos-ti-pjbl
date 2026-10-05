package br.pucpr.ativos.alocacao

import br.pucpr.ativos.ativo.Ativo
import br.pucpr.ativos.colaborador.Colaborador
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

/** Entrega de um ativo a um colaborador (RF21/RF25). */
@Entity
@Table(name = "alocacao")
class Alocacao(
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ativo_id", nullable = false)
    var ativo: Ativo,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "colaborador_id", nullable = false)
    var colaborador: Colaborador,

    @Column(name = "data_retirada", nullable = false)
    var dataRetirada: LocalDate,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
)
