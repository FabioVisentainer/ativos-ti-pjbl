package br.pucpr.ativos.alocacao

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface AlocacaoRepository : JpaRepository<Alocacao, Long> {

    @Query("select al from Alocacao al join fetch al.ativo join fetch al.colaborador order by al.id")
    fun listarComDetalhes(): List<Alocacao>
}
