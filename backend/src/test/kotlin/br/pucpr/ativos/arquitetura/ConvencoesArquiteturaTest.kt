package br.pucpr.ativos.arquitetura

import com.tngtech.archunit.core.domain.JavaClass
import com.tngtech.archunit.lang.ArchCondition
import com.tngtech.archunit.lang.CompositeArchRule
import com.tngtech.archunit.lang.ConditionEvents
import com.tngtech.archunit.lang.SimpleConditionEvent
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes
import com.tngtech.archunit.library.GeneralCodingRules
import jakarta.persistence.Entity
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
import kotlin.test.Test

/** Convenções de nomes e papéis do backend (ver .claude/skills/backend-kotlin-spring-modulos). */
class ConvencoesArquiteturaTest {

    @Test
    fun `controllers terminam em Controller`() {
        classes().that().areAnnotatedWith(RestController::class.java)
            .should().haveSimpleNameEndingWith("Controller")
            .check(classesDoBackend)
    }

    @Test
    fun `services terminam em Service`() {
        classes().that().areAnnotatedWith(Service::class.java)
            .should().haveSimpleNameEndingWith("Service")
            .check(classesDoBackend)
    }

    @Test
    fun `repositories sao interfaces terminadas em Repository`() {
        classes().that().areAssignableTo(Repository::class.java)
            .should().beInterfaces()
            .andShould().haveSimpleNameEndingWith("Repository")
            .because("a implementação é gerada pelo Spring Data a partir da interface")
            .check(classesDoBackend)
    }

    @Test
    fun `entidades JPA nao sao data class`() {
        classes().that().areAnnotatedWith(Entity::class.java)
            .should(naoSerDataClass())
            .because("equals, hashCode e copy de data class quebram os proxies lazy do Hibernate")
            .check(classesDoBackend)
    }

    @Test
    fun `excecoes ficam em shared e terminam em Exception`() {
        classes().that().areAssignableTo(Throwable::class.java)
            .should().resideInAPackage("$PACOTE_RAIZ.shared..")
            .andShould().haveSimpleNameEndingWith("Exception")
            .because("o ApiExceptionHandler traduz cada exceção de shared em um status HTTP (400, 404, 409)")
            .check(classesDoBackend)
    }

    @Test
    fun `tratamento global de erros fica em shared`() {
        classes().that().areAnnotatedWith(RestControllerAdvice::class.java)
            .should().resideInAPackage("$PACOTE_RAIZ.shared..")
            .check(classesDoBackend)
    }

    @Test
    fun `enums do dominio expoem o rotulo usado no contrato JSON`() {
        classes().that().areEnums()
            .should(terPropriedade("rotulo"))
            .check(classesDoBackend)
    }

    @Test
    fun `injecao de dependencias so pelo construtor`() {
        GeneralCodingRules.NO_CLASSES_SHOULD_USE_FIELD_INJECTION.check(classesDoBackend)
    }

    @Test
    fun `sem System out, logging do JUL nem excecoes genericas`() {
        CompositeArchRule.of(GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS)
            .and(GeneralCodingRules.NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING)
            .and(GeneralCodingRules.NO_CLASSES_SHOULD_THROW_GENERIC_EXCEPTIONS)
            .check(classesDoBackend)
    }

    private fun naoSerDataClass() =
        object : ArchCondition<JavaClass>("não ser data class") {
            override fun check(item: JavaClass, events: ConditionEvents) {
                // O compilador Kotlin só gera component1() para data classes.
                if (item.methods.any { it.name == "component1" }) {
                    events.add(SimpleConditionEvent.violated(item, "${item.name} é uma data class"))
                }
            }
        }

    private fun terPropriedade(nome: String) =
        object : ArchCondition<JavaClass>("ter a propriedade $nome") {
            override fun check(item: JavaClass, events: ConditionEvents) {
                if (item.fields.none { it.name == nome }) {
                    events.add(SimpleConditionEvent.violated(item, "${item.name} não tem a propriedade $nome"))
                }
            }
        }
}
