# Diagramas do backend — Vertical Slice + Clean Architecture + SOLID

Backend Kotlin/Spring Boot refatorado. Cada diagrama está em **Mermaid** (renderiza no GitHub) e em **imagem PNG** (pasta `docs/tde2/diagramas/`). As fontes `.mmd` ficam na mesma pasta.

## Onde cada princípio aparece

| Princípio | Aplicação no código |
|---|---|
| Vertical Slice | Uma pasta por módulo, cada uma com Entity, DTO, Controller, Service e Repository |
| Clean Architecture | Dependências apontam para dentro: Controller → Service → Repository → Entity; o domínio não conhece Spring MVC nem MySQL |
| SRP | Controller só HTTP; Service só caso de uso; Repository só persistência; `ApiExceptionHandler` só traduz erros |
| OCP | Novo módulo = nova pasta, sem alterar os existentes |
| LSP | Qualquer implementação de `*Consulta` substitui outra (mocks nos testes) |
| ISP | Portas pequenas: `ColaboradorConsulta` expõe só `exigirPorNome` |
| DIP | Services dependem de interfaces (`Repository`, `*Consulta`), nunca de classes concretas de outros módulos |

## 1. Diagrama de classes — visão geral dos módulos

Cada módulo (Vertical Slice) tem Controller → Service → Repository → Entity. Entre módulos só existem dependências por interfaces `*Consulta` (DIP) e as relações JPA (chaves estrangeiras) entre entidades.

![Diagrama de classes — visão geral dos módulos](classes-geral.png)

<details><summary>Código Mermaid</summary>

```mermaid
classDiagram
    direction TB

    class ApiExceptionHandler {
        <<RestControllerAdvice>>
    }

    namespace ativo {
        class AtivoController { <<Controller>> }
        class AtivoService { <<Service>> }
        class AtivoConsulta { <<interface>> }
        class AtivoRepository { <<interface>> }
        class Ativo { <<Entity>> }
        class StatusAtivo { <<enumeration>> }
    }

    namespace colaborador {
        class ColaboradorController { <<Controller>> }
        class ColaboradorService { <<Service>> }
        class ColaboradorConsulta { <<interface>> }
        class ColaboradorRepository { <<interface>> }
        class Colaborador { <<Entity>> }
    }

    namespace manutencao {
        class ManutencaoController { <<Controller>> }
        class ManutencaoService { <<Service>> }
        class ManutencaoConsulta { <<interface>> }
        class ManutencaoRepository { <<interface>> }
        class Manutencao { <<Entity>> }
    }

    namespace movimentacao {
        class MovimentacaoController { <<Controller>> }
        class MovimentacaoService { <<Service>> }
        class MovimentacaoConsulta { <<interface>> }
        class MovimentacaoRepository { <<interface>> }
        class Movimentacao { <<Entity>> }
    }

    namespace alocacao {
        class AlocacaoController { <<Controller>> }
        class AlocacaoService { <<Service>> }
        class AlocacaoRepository { <<interface>> }
        class Alocacao { <<Entity>> }
    }

    namespace usuario {
        class UsuarioController { <<Controller>> }
        class UsuarioService { <<Service>> }
        class UsuarioRepository { <<interface>> }
        class Usuario { <<Entity>> }
    }

    namespace dashboard {
        class DashboardController { <<Controller>> }
        class DashboardService { <<Service>> }
    }

    %% Camadas dentro de cada módulo: Controller -> Service -> Repository -> Entity
    AtivoController --> AtivoService
    AtivoService ..|> AtivoConsulta
    AtivoService --> AtivoRepository
    AtivoRepository ..> Ativo
    Ativo --> StatusAtivo

    ColaboradorController --> ColaboradorService
    ColaboradorService ..|> ColaboradorConsulta
    ColaboradorService --> ColaboradorRepository
    ColaboradorRepository ..> Colaborador

    ManutencaoController --> ManutencaoService
    ManutencaoService ..|> ManutencaoConsulta
    ManutencaoService --> ManutencaoRepository
    ManutencaoRepository ..> Manutencao

    MovimentacaoController --> MovimentacaoService
    MovimentacaoService ..|> MovimentacaoConsulta
    MovimentacaoService --> MovimentacaoRepository
    MovimentacaoRepository ..> Movimentacao

    AlocacaoController --> AlocacaoService
    AlocacaoService --> AlocacaoRepository
    AlocacaoRepository ..> Alocacao

    UsuarioController --> UsuarioService
    UsuarioService --> UsuarioRepository
    UsuarioRepository ..> Usuario

    DashboardController --> DashboardService

    %% Entre módulos: SOMENTE por interfaces *Consulta (DIP)
    AtivoService --> ColaboradorConsulta : exigirPorNome
    DashboardService --> AtivoConsulta
    DashboardService --> ManutencaoConsulta
    DashboardService --> MovimentacaoConsulta

    %% Relações JPA (chaves estrangeiras)
    Ativo --> Colaborador : colaborador
    Manutencao --> Ativo : ativo
    Alocacao --> Ativo : ativo
    Alocacao --> Colaborador : colaborador
    Movimentacao --> Ativo : ativo
    Movimentacao --> Colaborador : colaborador
    Movimentacao --> Usuario : registradoPor
```

</details>

## 2. Diagrama de classes — detalhe do módulo `ativo`

Mostra atributos, métodos, DTOs e as abstrações das quais o `AtivoService` depende (`AtivoRepository` e `ColaboradorConsulta`). Os demais módulos seguem o mesmo molde.

![Diagrama de classes — detalhe do módulo `ativo`](classes-ativo.png)

<details><summary>Código Mermaid</summary>

```mermaid
classDiagram
    direction LR

    class AtivoController {
        <<Controller>>
        -service: AtivoService
        +pesquisar(busca, status) List~AtivoResponse~
        +inserir(request) AtivoResponse
        +alterar(numeroPatrimonio, campos) AtivoResponse
        +excluir(numeroPatrimonio) MensagemResponse
    }

    class AtivoService {
        <<Service>>
        -repository: AtivoRepository
        -colaboradores: ColaboradorConsulta
        +pesquisar(busca, status) List~AtivoResponse~
        +criar(request) AtivoResponse
        +alterar(numeroPatrimonio, campos) AtivoResponse
        +excluir(numeroPatrimonio) MensagemResponse
        +contarPorStatus() Map
        +contarPorSetor() List~AtivoPorSetor~
    }

    class AtivoConsulta {
        <<interface>>
        +contarPorStatus() Map
        +contarPorSetor() List~AtivoPorSetor~
    }

    class ColaboradorConsulta {
        <<interface>>
        +exigirPorNome(nome) Colaborador
    }

    class AtivoRepository {
        <<interface>>
        +existsByNumeroPatrimonio(n) Boolean
        +buscarPorNumeroPatrimonio(n) Ativo
        +pesquisar(padrao, status) List~Ativo~
        +totaisPorStatus() List~StatusTotal~
        +totaisPorSetor() List~SetorTotal~
    }

    class JpaRepository {
        <<interface>>
        +save()
        +delete()
        +flush()
    }

    class Ativo {
        <<Entity>>
        +id: Long
        +tipo: String
        +marca: String
        +modelo: String
        +numeroPatrimonio: String
        +numeroSerie: String
        +status: StatusAtivo
        +colaborador: Colaborador
        +setor: String
        +dataAquisicao: LocalDate
        +valorAquisicao: BigDecimal
        +equipamento() String
    }

    class StatusAtivo {
        <<enumeration>>
        EM_ESTOQUE
        EM_USO
        EM_MANUTENCAO
        BAIXADO
        +rotulo: String
        +doRotulo(texto) StatusAtivo
    }

    class AtivoResponse {
        <<DTO>>
        +id +tipo +marca +modelo
        +numeroPatrimonio +numeroSerie
        +status +colaborador +setor
        +dataAquisicao +valorAquisicao
    }

    class NovoAtivoRequest {
        <<DTO>>
        +tipo +marca +modelo
        +numeroPatrimonio +numeroSerie
        +status +colaborador +setor
        +dataAquisicao +valorAquisicao
    }

    class MensagemResponse {
        <<DTO>>
        +mensagem: String
    }

    class AtivoPorSetor {
        <<DTO>>
        +setor: String
        +quantidade: Long
    }

    AtivoController --> AtivoService : usa
    AtivoController ..> NovoAtivoRequest : recebe
    AtivoController ..> AtivoResponse : devolve
    AtivoController ..> MensagemResponse : devolve
    AtivoService ..|> AtivoConsulta : implementa
    AtivoService --> AtivoRepository : depende da abstração
    AtivoService --> ColaboradorConsulta : depende da abstração
    AtivoService ..> Ativo : regras de negócio
    AtivoService ..> AtivoPorSetor : devolve
    AtivoRepository --|> JpaRepository
    AtivoRepository ..> Ativo : persiste
    Ativo --> StatusAtivo
```

</details>

## 3. Diagrama de componentes — camadas da Clean Architecture

Fluxo Frontend → Proxy → API Gateway → Backend → MySQL. Dentro do backend: Apresentação → Aplicação → (Infraestrutura, Domínio). O domínio não depende de nada.

![Diagrama de componentes — camadas da Clean Architecture](componentes-camadas.png)

<details><summary>Código Mermaid</summary>

```mermaid
flowchart TB
    FE["Frontend Next.js — proxy: rewrites /api/*"]
    GW["API Gateway — Spring Cloud Gateway :8080 — Path=/api/** · CORS"]

    subgraph BE["Backend Kotlin / Spring Boot :8081"]
        direction TB
        subgraph PRES["Apresentação"]
            direction LR
            CTRL["Controllers<br/>(7 módulos)"]
            EXH["ApiExceptionHandler<br/>(erros → HTTP)"]
            EXH -.-> CTRL
        end
        subgraph APP["Aplicação (casos de uso)"]
            direction LR
            SVC["Services<br/>@Transactional"]
            PORT["Portas *Consulta<br/>(interfaces)"]
            SVC --> PORT
        end
        subgraph INFRA["Infraestrutura"]
            direction LR
            REPO["Repositories<br/>Spring Data JPA<br/>persistem as Entities"]
            FLY["Flyway<br/>V1 schema · V2 dados"]
        end
        subgraph DOM["Domínio"]
            direction LR
            ENT["Entities + Enums<br/>regras e invariantes do negócio"]
        end
    end

    DB[("MySQL 8.4")]

    FE -->|HTTP| GW
    GW -->|HTTP| PRES
    PRES -->|chama| APP
    APP -->|usa abstração| INFRA
    APP -->|usa| DOM
    INFRA -->|JDBC| DB
```

</details>

## 4. Diagrama de componentes — módulos (Vertical Slice)

Cada fatia vertical é autônoma (Controller, Service, Repository, Entity). As setas `usa` entre módulos passam exclusivamente pelas portas `*Consulta`.

![Diagrama de componentes — módulos (Vertical Slice)](componentes-modulos.png)

<details><summary>Código Mermaid</summary>

```mermaid
flowchart TB
    GW["API Gateway :8080"]

    subgraph SHARED["shared (kernel)"]
        EXC["Exceções · ApiError<br/>ApiExceptionHandler<br/>SituacaoPessoa"]
    end

    subgraph M_ATIVO["módulo ativo"]
        direction LR
        A_C["AtivoController"] --> A_S["AtivoService"] --> A_R["AtivoRepository"] --> A_E["Ativo"]
        A_P(["AtivoConsulta"])
        A_S -.implementa.-> A_P
    end

    subgraph M_COL["módulo colaborador"]
        direction LR
        C_C["ColaboradorController"] --> C_S["ColaboradorService"] --> C_R["ColaboradorRepository"] --> C_E["Colaborador"]
        C_P(["ColaboradorConsulta"])
        C_S -.implementa.-> C_P
    end

    subgraph M_MAN["módulo manutencao"]
        direction LR
        M_C["ManutencaoController"] --> M_S["ManutencaoService"] --> M_R["ManutencaoRepository"] --> M_E["Manutencao"]
        M_P(["ManutencaoConsulta"])
        M_S -.implementa.-> M_P
    end

    subgraph M_MOV["módulo movimentacao"]
        direction LR
        V_C["MovimentacaoController"] --> V_S["MovimentacaoService"] --> V_R["MovimentacaoRepository"] --> V_E["Movimentacao"]
        V_P(["MovimentacaoConsulta"])
        V_S -.implementa.-> V_P
    end

    subgraph M_ALO["módulo alocacao"]
        direction LR
        L_C["AlocacaoController"] --> L_S["AlocacaoService"] --> L_R["AlocacaoRepository"] --> L_E["Alocacao"]
    end

    subgraph M_USU["módulo usuario"]
        direction LR
        U_C["UsuarioController"] --> U_S["UsuarioService"] --> U_R["UsuarioRepository"] --> U_E["Usuario"]
    end

    subgraph M_DASH["módulo dashboard (sem entidade)"]
        direction LR
        D_C["DashboardController"] --> D_S["DashboardService"]
    end

    DB[("MySQL")]

    GW --> A_C & C_C & M_C & V_C & L_C & U_C & D_C

    %% dependências entre módulos: somente pelas portas *Consulta (DIP)
    A_S -->|usa| C_P
    D_S -->|usa| A_P
    D_S -->|usa| M_P
    D_S -->|usa| V_P

    A_R & C_R & M_R & V_R & L_R & U_R --> DB
```

</details>
