package br.pucpr.ativos.movimentacao

import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface MovimentacaoRepository : JpaRepository<Movimentacao, Long> {

    @EntityGraph(attributePaths = ["ativo", "colaborador", "registradoPor"])
    fun findTop10ByOrderByDataDescIdDesc(): List<Movimentacao>
}
