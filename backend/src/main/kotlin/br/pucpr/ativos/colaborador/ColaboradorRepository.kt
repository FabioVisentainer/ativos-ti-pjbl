package br.pucpr.ativos.colaborador

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ColaboradorRepository : JpaRepository<Colaborador, Long> {

    fun findFirstByNomeIgnoreCase(nome: String): Colaborador?

    /** Consulta de leitura (read model): conta os ativos de cada colaborador sem carregar entidades de "ativo". */
    @Query(
        """
        select c.id as id, c.nome as nome, c.matricula as matricula, c.setor as setor,
               c.situacao as situacao, count(a) as ativosAlocados
        from Colaborador c left join Ativo a on a.colaborador = c
        group by c.id, c.nome, c.matricula, c.setor, c.situacao
        order by c.id
        """,
    )
    fun listarComTotalDeAtivos(): List<ColaboradorComTotal>
}
