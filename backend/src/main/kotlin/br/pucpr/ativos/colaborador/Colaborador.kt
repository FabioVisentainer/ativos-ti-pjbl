package br.pucpr.ativos.colaborador

import br.pucpr.ativos.shared.SituacaoPessoa
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

/** Pessoa que recebe ativos (não é necessariamente um usuário do sistema). */
@Entity
@Table(name = "colaborador")
class Colaborador(
    @Column(name = "nome", nullable = false, length = 120)
    var nome: String,

    @Column(name = "matricula", nullable = false, unique = true, length = 20)
    var matricula: String,

    @Column(name = "setor", nullable = false, length = 60)
    var setor: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao", nullable = false, length = 10)
    var situacao: SituacaoPessoa,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
)
