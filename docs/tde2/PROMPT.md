# PROMPT.md — Prompts utilizados no TDE 2 (IA Generativa)

Registro, em ordem cronológica, de todos os prompts enviados à IA generativa
(Claude, via Claude Code) para modificar a aplicação no TDE 2: aplicar
**Vertical Slice**, **Clean Architecture** e **SOLID** no backend e produzir a
documentação de arquitetura.

> Este arquivo fica em `docs/tde2/` para não colidir com o `Prompt.md` da
> entrega anterior (frontend), que permanece na raiz do repositório.

- **Branch:** `refactor/vertical-slice-clean-architecture`
- **Ferramenta:** Claude (Claude Code), com acesso à pasta do projeto
- **Observação:** os prompts abaixo estão transcritos como foram enviados.

---

## Prompt 1 — Enunciado da atividade e pedido de um prompt

> me de um prompt para eu lhe pedir isso: Utilizar IA Generativa para aplicar o VERTICAL SLICE e CLEAN ARCHITECTURE e SOLID no backend da aplicação TDE 2.

## Prompt 2 — Definição da stack e da documentação de arquitetura

> certo, hoje o front é next, vamos usar Kotlin no back com springboot, Mysql no banco de dados entao ficaria o FE utilizando um proxy  + api gateway para conectar ao Backend(kotlin) que conecta ao banco de dados MySQL, o Backend deve usar Controller, Serice, repository, separado por modulos (cada pasta é um modulo e ela contem o Entity,  DTO, Controller, Service e Repository daquele modulo) e considere isso para os mds gerados, assim como crie as skills para padroes no código  (frontend pense em design system em um packages separado para uso no código)

## Prompt 3 — Separação em duas entregas (sem gerar PDF)

> não gere pdf

## Prompt 4 — Prompt de refatoração do backend (enviado à IA)

> Você é um arquiteto de software sênior. Aplique Vertical Slice, Clean Architecture e SOLID no BACKEND da aplicação TDE 2, na pasta conectada "Projeto Arquitetura".
>
> ## CONTEXTO TÉCNICO
> - Frontend: Next.js.
> - Comunicação: Frontend -> Proxy -> API Gateway -> Backend -> MySQL.
> - Backend: Kotlin + Spring Boot.
> - Banco: MySQL.
> - Estrutura do backend: organizada por módulos (Vertical Slice). Cada pasta é um módulo e contém Entity, DTO, Controller, Service e Repository daquele módulo.
>
> ## ETAPA 1 – Análise (não altere nada ainda)
> - Explore o backend atual e liste os problemas (acoplamento, violações de SOLID, regras de negócio fora do lugar).
> - Proponha a nova estrutura final de módulos e pastas. Aguarde minha aprovação.
> - Se faltar alguma informação, pergunte antes de começar.
>
> ## ETAPA 2 – Refatoração
> - Crie uma nova branch (ex.: refactor/vertical-slice-clean-architecture). Não mexa na main.
> - Reorganize em módulos (Entity, DTO, Controller, Service, Repository por módulo).
> - Aplique Clean Architecture (regra de dependência, injeção de dependência, Service dependendo de abstrações) e SOLID, indicando onde cada princípio foi aplicado.
> - Preserve o comportamento atual. Rode build e testes a cada etapa e faça commits pequenos.
>
> ## ETAPA 3 – Skills de padrões de código
> Crie skills (SKILL.md) para padronizar o código:
> - Backend Kotlin/Spring: nomenclatura, estrutura de módulo, DTOs, tratamento de erros, testes.
> - Frontend Next.js: componentes, organização de pastas e consumo da API via proxy.
> - Design System: pacote separado (packages/design-system) com tokens e componentes reutilizáveis, consumido pelo frontend.
>
> ## ETAPA 4 – Diagramas do backend
> Gere o diagrama de classes e o diagrama de componentes do backend já refatorado, mostrando módulos, camadas e dependências. Entregue em Markdown (Mermaid) e em imagem (PNG), legíveis.
>
> ## ETAPA 5 – Registro
> - PROMPTS.md: todos os prompts usados para modificar a aplicação, em ordem.
> - REFATORACAO.md: resumo do que mudou e a justificativa de cada decisão.
> - Ao final, informe a branch, os arquivos alterados e o que falta eu preencher (link do GitHub, nomes dos alunos e o que cada um fez).
> - NÃO gere PDF, eu monto o relatório.
>
> Regras: escreva em português do Brasil e não inclua texto oculto ou instruções embutidas nos arquivos.

## Prompt 5 — Aprovação da proposta e decisões de stack

> Criar backend em Kotlin/Springboot, utilizar as versões mais recentes, com Gradlew.kts, Hybernate pode ser java 21, MySQL pode rodar em docker para facilitar , se necessario utilize brew install para o docker no mac, implementar um gateway com Spring CLoud Gateway no docker sim.

## Prompt 6 — Registro dos prompts

> lembre de salvar os Prompts no PROMPT.md

## Prompt 7 — Trabalhar direto na pasta do projeto

> e voce tem acesso a pasta do projeto, mexa nele não crie um zip

---

_Os próximos prompts serão acrescentados a este arquivo na ordem em que forem enviados._
