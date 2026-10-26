package br.pucpr.ativos.arquitetura

import com.tngtech.archunit.core.domain.JavaClasses
import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption

/** Pacote raiz do backend: cada subpacote direto é um módulo vertical, exceto `shared`. */
const val PACOTE_RAIZ = "br.pucpr.ativos"

/**
 * Bytecode de produção do backend (sem as classes de teste), importado uma única vez
 * e compartilhado por todos os testes arquiteturais.
 */
val classesDoBackend: JavaClasses by lazy {
    ClassFileImporter()
        .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
        .importPackages(PACOTE_RAIZ)
}
