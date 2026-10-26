package br.pucpr.ativos.manutencao

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ManutencaoRepository : JpaRepository<Manutencao, Long> {

    @Query("select m from Manutencao m join fetch m.ativo order by m.data desc, m.id")
    fun listarComAtivo(): List<Manutencao>
}
