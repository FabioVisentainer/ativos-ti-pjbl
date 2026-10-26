# REFATORACAO.md — Backend com Vertical Slice, Clean Architecture e SOLID

Branch: `refactor/vertical-slice-clean-architecture`

## 1. Ponto de partida
O backend original (`api/`) era um conjunto de **Azure Functions em Node.js/JavaScript** com **MongoDB Atlas** apenas para `ativos`; as demais telas liam JSONs estáticos (`api/src/data/*.json`). Por isso a refatoração foi uma **migração para Kotlin + Spring Boot + MySQL** em um novo diretório `backend/`. O diretório `api/` foi mantido intacto para não quebrar o deploy atual no Azure.

### Problemas encontrados
| # | Problema | Princípio |
|---|---|---|
| 1 | Cada function misturava HTTP, validação, regra de negócio e acesso a dados | SRP |
| 2 | Acesso direto ao driver do MongoDB, sem abstração de repositório | DIP |
| 3 | Dados inconsistentes: ativo criado no CRUD não aparecia no dashboard (que lia JSON) | Regra de negócio fora do lugar |
| 4 | ID por "último + 1" e checagem de duplicidade não atômica (condição de corrida) | Integridade |
| 5 | `STATUS_VALIDOS` duplicado; `try/catch` e resposta de erro repetidos em todas as functions | DRY / OCP |
| 6 | Status como string solta | Tipagem |
| 7 | Relações por nome (`colaborador: "Marina Alves"`) em vez de chaves estrangeiras | Modelagem |
| 8 | `error.message` devolvido ao cliente; rotas `anonymous` | Segurança |
| 9 | Sem testes | — |

## 2. Arquitetura resultante
```
Frontend (Next.js, rewrites /api/*) ─▶ API Gateway :8080 ─▶ Backend :8081 ─▶ MySQL
                                       (Spring Cloud Gateway) (Spring Boot)
```
- **Vertical Slice:** uma pasta por módulo (`ativo`, `colaborador`, `usuario`, `manutencao`, `alocacao`, `movimentacao`, `dashboard`), cada uma com Entity, DTO, Controller, Service e Repository.
- **Clean Architecture:** `Controller → Service → Repository → Entity`; a seta nunca volta. O domínio não conhece Spring MVC nem MySQL.
- **Comunicação entre módulos:** somente por portas de leitura (`AtivoConsulta`, `ColaboradorConsulta`, `ManutencaoConsulta`, `MovimentacaoConsulta`).
- **Erros centralizados** em `shared/ApiExceptionHandler`; corpo `{"error": "..."}` (mesmo contrato do frontend).
- **Banco:** esquema relacional com FKs, `UNIQUE` em patrimônio/matrícula/conta, `CHECK` nos enums; Flyway (`V1__schema.sql`, `V2__dados_iniciais.sql`) com os mesmos dados dos JSONs.
- **Gateway:** Spring Cloud Gateway com rota `Path=/api/**` e CORS configurável.
- **Proxy do frontend:** `next.config.ts` ativa `rewrites` quando `GATEWAY_URL` está definido (`npm run dev:backend`); sem ele, mantém o export estático do Azure Static Web Apps.

## 3. Onde cada princípio SOLID foi aplicado
| Princípio | Aplicação |
|---|---|
| **S** | `AtivoController` só HTTP; `AtivoService` só caso de uso; `AtivoRepository` só persistência; `ApiExceptionHandler` só traduz erros |
| **O** | Novo módulo = nova pasta; módulos existentes não mudam. Novos status/erros entram sem tocar nos handlers existentes |
| **L** | Qualquer implementação de uma `*Consulta` substitui outra (os testes usam mocks no lugar dos Services reais) |
| **I** | Portas mínimas: `ColaboradorConsulta` expõe apenas `exigirPorNome`; `MovimentacaoConsulta` apenas `ultimas` |
| **D** | Services dependem de interfaces (`Repository`, `*Consulta`); o `DashboardService` não conhece nenhuma classe concreta de outro módulo |

## 4. Mudanças de comportamento (intencionais)
1. `DELETE /api/ativos/{patrimônio}` de ativo com manutenção/alocação/movimentação agora responde **409** (antes apagava sem olhar o histórico).
2. `POST`/`PUT` com `colaborador` exigem um colaborador **existente** (400 se não existir); antes aceitava qualquer texto.
3. IDs gerados pelo MySQL (`AUTO_INCREMENT`) e patrimônio com `UNIQUE`: sem condição de corrida.
4. Dashboard e colaboradores passam a refletir o CRUD de ativos (mesmo banco).
5. Busca por `LIKE` insensível a maiúsculas (o MySQL também ignora acentos); antes era regex.
6. `PUT` com `"status": null` ou inválido responde 400.
7. Novo endpoint `GET /api/movimentacoes` (últimas 10), necessário ao módulo `movimentacao`.

## 5. Testes
`AtivoServiceTest`, `AtivoControllerTest` e `DashboardServiceTest` (MockK + MockMvc standalone, sem banco).

## 6. Limitações e débitos conhecidos
- **Compilação e testes não foram executados pela IA:** o ambiente em que ela trabalhou bloqueia Maven Central e Gradle Plugin Portal e não tem Docker. O código foi revisado manualmente; o primeiro `./gradlew build` na sua máquina pode apontar ajustes de API (a stack é muito recente: Spring Boot 4.1, Jackson 3, Kotlin 2.4).
- Não há teste de integração com MySQL (seria Testcontainers).
- Sem autenticação/autorização (perfis de usuário existem só como dado).
- `Ativo.colaborador` e `Alocacao` guardam a mesma informação; o ideal é `Alocacao` ser a fonte da verdade.
- `custoPorMes`/`custoAcumulado` somam em memória (suficiente para o volume atual).
- O pacote `packages/design-system` está descrito na skill `design-system-pacote`, mas os componentes ainda não foram extraídos de `frontend/components/ui`.
- O `api/` (Node/MongoDB) continua no repositório até a troca definitiva.
