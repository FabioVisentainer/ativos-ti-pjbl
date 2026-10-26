package br.pucpr.ativos.ativo

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

/** Abstração de persistência de ativos (o Service depende desta interface, não do MySQL). */
interface AtivoRepository : JpaRepository<Ativo, Long> {

    fun existsByNumeroPatrimonio(numeroPatrimonio: String): Boolean

    @Query("select a from Ativo a left join fetch a.colaborador where a.numeroPatrimonio = :numeroPatrimonio")
    fun buscarPorNumeroPatrimonio(@Param("numeroPatrimonio") numeroPatrimonio: String): Ativo?

    /** Pesquisa livre (RF13/RF17). "padrao" já vem em minúsculas e com os curingas %…%. */
    @Query(
        """
        select a from Ativo a left join fetch a.colaborador c
        where a.status in :status
          and (lower(a.numeroPatrimonio) like :padrao
            or lower(a.numeroSerie) like :padrao
            or lower(a.tipo) like :padrao
            or lower(a.marca) like :padrao
            or lower(a.modelo) like :padrao
            or lower(c.nome) like :padrao)
        order by a.id
        """,
    )
    fun pesquisar(
        @Param("padrao") padrao: String,
        @Param("status") status: Collection<StatusAtivo>,
    ): List<Ativo>

    @Query("select a.status as status, count(a) as total from Ativo a group by a.status")
    fun totaisPorStatus(): List<StatusTotal>

    @Query("select a.setor as setor, count(a) as quantidade from Ativo a where a.setor is not null group by a.setor")
    fun totaisPorSetor(): List<SetorTotal>
}
