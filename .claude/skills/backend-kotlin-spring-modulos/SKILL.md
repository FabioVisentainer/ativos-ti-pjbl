---
name: backend-kotlin-spring-modulos
description: Padrões de código do backend Kotlin + Spring Boot do sistema de ativos de TI — módulos verticais (Entity, DTO, Controller, Service, Repository), Clean Architecture, SOLID, erros e testes. Use ao criar ou alterar qualquer código em backend/.
---

# Backend Kotlin/Spring — módulos verticais (Vertical Slice + Clean Architecture)

## Estrutura obrigatória
Cada funcionalidade é um **módulo** (pasta) em `backend/src/main/kotlin/br/pucpr/ativos/<modulo>/` com:

| Arquivo | Papel |
|---|---|
| `<Nome>.kt` | **Entity** JPA + enums do domínio; guarda invariantes (`init { ... }`) |
| `<Nome>Dto.kt` | DTOs de entrada/saída (`data class`) e mapeadores (`fun Entity.toResponse()`) |
| `<Nome>Controller.kt` | Camada HTTP: converte requisição, delega ao Service. **Nenhuma regra de negócio.** |
| `<Nome>Service.kt` | Caso de uso (`@Transactional`) + interface `<Nome>Consulta` (porta de leitura) |
| `<Nome>Repository.kt` | `interface` Spring Data JPA; consultas `@Query` em JPQL |

Código transversal fica só em `shared/` (exceções, `ApiError`, `ApiExceptionHandler`, enums comuns).

## Regra de dependência (Clean Architecture)
`Controller → Service → Repository → Entity`. A seta nunca volta.
- Um módulo **nunca** usa o Repository ou o Service concreto de outro módulo.
- Comunicação entre módulos: apenas pela interface `<Nome>Consulta` do módulo dono (DIP). Ex.: `AtivoService` usa `ColaboradorConsulta`; `DashboardService` usa `AtivoConsulta`, `ManutencaoConsulta`, `MovimentacaoConsulta`.
- Evite ciclos de beans: se A precisa de B, B não pode precisar de A. Use consulta JPQL no próprio repository como alternativa.

## SOLID aplicado
- **S**: Controller só HTTP; Service só caso de uso; Repository só persistência; erros em `ApiExceptionHandler`.
- **O**: novo módulo = nova pasta; nenhum módulo existente muda.
- **L**: qualquer implementação de `<Nome>Consulta` pode substituir outra (mocks nos testes).
- **I**: portas pequenas e específicas (`ColaboradorConsulta` só expõe `exigirPorNome`).
- **D**: Services dependem de interfaces (Repository, `*Consulta`), nunca de MySQL.

## Convenções
- Pacote base `br.pucpr.ativos`; nomes de domínio em português, iguais ao contrato JSON do frontend (`frontend/lib/types.ts`).
- Enums guardam o nome da constante no banco e expõem `rotulo` (texto do contrato) e `doRotulo()`.
- DTOs nunca expõem Entity. O mapeamento acontece **dentro** da transação do Service (relações são `LAZY`, `open-in-view: false`).
- Entities: `class` com `var`/`val` no construtor, `id: Long? = null` por último, `@GeneratedValue(IDENTITY)`; nunca `data class`.
- Dinheiro = `BigDecimal` (`DECIMAL(12,2)`). Datas = `LocalDate`/`LocalDateTime`.
- Esquema do banco **somente** via Flyway (`db/migration/V<n>__descricao.sql`); `ddl-auto: none`. Nunca editar uma migração já aplicada: criar a próxima versão.
- Novo campo/tabela = migração + Entity + DTO + teste.

## Erros
Lançar `RegraDeNegocioException` (400), `RecursoNaoEncontradoException` (404) ou `ConflitoException` (409). O corpo é sempre `{"error": "mensagem"}`. Nunca devolver `e.message` de exceções inesperadas (já tratado no handler: 500 genérico).

## Testes
- Service: teste unitário com MockK, sem Spring (`AtivoServiceTest`).
- Controller: `MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(ApiExceptionHandler())` (`AtivoControllerTest`).
- Um teste por regra de negócio e por código de status relevante. Nome do teste descreve o comportamento.
- Arquitetura: as regras deste documento são verificadas com ArchUnit em `src/test/kotlin/br/pucpr/ativos/arquitetura/`. Convenção nova = regra nova lá.

## Checklist antes de concluir
1. `./gradlew :backend:test` verde. 2. Contrato JSON inalterado (ou `frontend/lib/types.ts` atualizado junto). 3. Nenhuma dependência cruzada entre módulos fora das `*Consulta`.
