package br.pucpr.ativos.usuario

import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UsuarioService(private val repository: UsuarioRepository) {

    @Transactional(readOnly = true)
    fun listar(): List<UsuarioResponse> =
        repository.findAll(Sort.by("id")).map { it.toResponse() }
}
