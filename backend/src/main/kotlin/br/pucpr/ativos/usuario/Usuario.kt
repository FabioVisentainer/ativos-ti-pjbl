package br.pucpr.ativos.usuario

import br.pucpr.ativos.shared.SituacaoPessoa
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

enum class PerfilUsuario(val rotulo: String) {
    COLABORADOR("Colaborador"),
    TECNICO_TI("Técnico de TI"),
    GESTOR_TI("Gestor de TI"),
}

/** Usuário do sistema e seu perfil de acesso (RF06/RF07). */
@Entity
@Table(name = "usuario")
class Usuario(
    @Column(name = "nome", nullable = false, length = 120)
    var nome: String,

    @Column(name = "conta_corporativa", nullable = false, unique = true, length = 160)
    var contaCorporativa: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "perfil", nullable = false, length = 20)
    var perfil: PerfilUsuario,

    @Column(name = "ultimo_acesso")
    var ultimoAcesso: LocalDateTime?,

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao", nullable = false, length = 10)
    var situacao: SituacaoPessoa,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
)
