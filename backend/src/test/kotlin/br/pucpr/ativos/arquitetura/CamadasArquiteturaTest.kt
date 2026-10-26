package br.pucpr.ativos.arquitetura

import com.tngtech.archunit.core.domain.JavaClass.Predicates.assignableTo
import com.tngtech.archunit.core.domain.JavaClass.Predicates.simpleNameEndingWith
import com.tngtech.archunit.core.domain.properties.CanBeAnnotated.Predicates.annotatedWith
import com.tngtech.archunit.lang.CompositeArchRule
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noMethods
import com.tngtech.archunit.library.Architectures.layeredArchitecture
import jakarta.persistence.Entity
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RestController
import kotlin.test.Test

/**
 * Regra de dependência da Clean Architecture: Controller → Service → Repository → Entity, nunca o contrário.
 * As camadas são reconhecidas pelo papel da classe (anotação ou tipo), porque todas convivem
 * no pacote do próprio módulo (Vertical Slice).
 */
class CamadasArquiteturaTest {

    @Test
    fun `dependencias entre camadas so apontam para dentro`() {
        layeredArchitecture()
            .consideringOnlyDependenciesInLayers()
            .layer(CONTROLLER).definedBy(annotatedWith(RestController::class.java))
            // As portas *Consulta fazem parte da camada de caso de uso do módulo dono.
            .layer(SERVICE).definedBy(simpleNameEndingWith("Consulta").or(annotatedWith(Service::class.java)))
            .layer(REPOSITORY).definedBy(assignableTo(Repository::class.java))
            .layer(ENTITY).definedBy(annotatedWith(Entity::class.java))
            .whereLayer(CONTROLLER).mayNotBeAccessedByAnyLayer()
            .whereLayer(SERVICE).mayOnlyBeAccessedByLayers(CONTROLLER)
            .whereLayer(REPOSITORY).mayOnlyBeAccessedByLayers(SERVICE)
            .whereLayer(ENTITY).mayOnlyBeAccessedByLayers(SERVICE, REPOSITORY)
            .whereLayer(ENTITY).mayNotAccessAnyLayer()
            .check(classesDoBackend)
    }

    @Test
    fun `services nao dependem da camada HTTP`() {
        noClasses().that().areAnnotatedWith(Service::class.java)
            .or().haveSimpleNameEndingWith("Consulta")
            .should().dependOnClassesThat()
            .resideInAnyPackage("org.springframework.web..", "org.springframework.http..", "jakarta.servlet..")
            .because("converter requisição e resposta HTTP é papel exclusivo do Controller")
            .check(classesDoBackend)
    }

    @Test
    fun `controllers nao abrem transacao`() {
        CompositeArchRule
            .of(
                noClasses().that().areAnnotatedWith(RestController::class.java)
                    .should().beAnnotatedWith(Transactional::class.java),
            )
            .and(
                noMethods().that().areDeclaredInClassesThat().areAnnotatedWith(RestController::class.java)
                    .should().beAnnotatedWith(Transactional::class.java),
            )
            .because("a transação pertence ao caso de uso (Service), onde as entidades viram DTOs")
            .check(classesDoBackend)
    }

    @Test
    fun `nenhuma classe depende diretamente do driver do banco`() {
        noClasses().should().dependOnClassesThat().resideInAnyPackage("com.mysql..", "java.sql..", "javax.sql..")
            .because("o acesso ao MySQL passa só pelos Repositories do Spring Data")
            .check(classesDoBackend)
    }

    private companion object {
        const val CONTROLLER = "Controller"
        const val SERVICE = "Service"
        const val REPOSITORY = "Repository"
        const val ENTITY = "Entity"
    }
}
