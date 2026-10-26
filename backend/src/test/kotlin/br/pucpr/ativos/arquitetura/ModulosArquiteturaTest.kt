package br.pucpr.ativos.arquitetura

import com.tngtech.archunit.core.domain.JavaClass
import com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAPackage
import com.tngtech.archunit.core.domain.JavaClass.Predicates.resideOutsideOfPackage
import com.tngtech.archunit.lang.ArchCondition
import com.tngtech.archunit.lang.ConditionEvents
import com.tngtech.archunit.lang.SimpleConditionEvent
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes
import com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RestController
import kotlin.test.Test

/** Isolamento entre os módulos verticais: um módulo só conversa com outro pela porta `*Consulta` dele. */
class ModulosArquiteturaTest {

    @Test
    fun `modulos nao tem dependencias ciclicas`() {
        slices().matching("$PACOTE_RAIZ.(*)..").namingSlices("módulo \$1")
            .should().beFreeOfCycles()
            .check(classesDoBackend)
    }

    @Test
    fun `repositories services e controllers so sao usados dentro do proprio modulo`() {
        classes().that().areAssignableTo(Repository::class.java)
            .or().areAnnotatedWith(Service::class.java)
            .or().areAnnotatedWith(RestController::class.java)
            .should(serUsadasApenasDentroDoProprioModulo())
            .because("outros módulos devem depender da porta *Consulta do módulo dono (DIP)")
            .check(classesDoBackend)
    }

    @Test
    fun `portas Consulta sao interfaces implementadas por um Service do proprio modulo`() {
        classes().that().haveSimpleNameEndingWith("Consulta")
            .should().beInterfaces()
            .andShould(serImplementadasPorServiceDoProprioModulo())
            .check(classesDoBackend)
    }

    @Test
    fun `shared nao depende de nenhum modulo`() {
        classes().that().resideInAPackage("$PACOTE_RAIZ.shared..")
            .should().onlyDependOnClassesThat(
                resideInAPackage("$PACOTE_RAIZ.shared..").or(resideOutsideOfPackage("$PACOTE_RAIZ..")),
            )
            .because("código transversal não pode conhecer as regras de um módulo específico")
            .check(classesDoBackend)
    }

    private fun serUsadasApenasDentroDoProprioModulo() =
        object : ArchCondition<JavaClass>("ser usadas apenas dentro do próprio módulo") {
            override fun check(item: JavaClass, events: ConditionEvents) {
                item.directDependenciesToSelf
                    .filter { it.originClass.packageName != item.packageName }
                    .forEach { events.add(SimpleConditionEvent.violated(it, it.description)) }
            }
        }

    private fun serImplementadasPorServiceDoProprioModulo() =
        object : ArchCondition<JavaClass>("ser implementadas por um @Service do próprio módulo") {
            override fun check(item: JavaClass, events: ConditionEvents) {
                val implementada = item.allSubclasses.any {
                    it.isAnnotatedWith(Service::class.java) && it.packageName == item.packageName
                }
                if (!implementada) {
                    events.add(
                        SimpleConditionEvent.violated(
                            item,
                            "${item.name} não é implementada por nenhum @Service de ${item.packageName}",
                        ),
                    )
                }
            }
        }
}
