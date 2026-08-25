# Prompt.md — Uso de IA Generativa (IAG) no projeto

Conforme exigido no checklist do PJBL, este arquivo documenta os prompts
utilizados para gerar o frontend do projeto com o auxílio de IA generativa
(Claude, via Claude Code / Cowork).

## Contexto fornecido à IA

Antes de gerar qualquer código, a IA recebeu como contexto os documentos já
existentes do projeto:

- `Requisitos Sistema Ativos TI.docx` — requisitos funcionais (RF) e não
  funcionais (RNF) do Sistema de Controle de Ativos de Informática.
- `Sobre o Projeto.docx` — visão geral do projeto, personas e funcionalidades
  principais.
- Um protótipo funcional em HTML (`Ativos-TI-standalone.html`), com login
  mock (SSO) e 7 telas: Dashboard, Ativos, Colaboradores, Alocações,
  Manutenções, Relatórios e Usuários e Permissões.

## Prompts utilizados (em ordem)

1. **Prompt inicial** — o enunciado do PJBL colado diretamente na conversa:

   > "Em grupo PJBL, alunos criam frontend que se comunica com azure
   > functions e mock backend. (Opcional: utilizar React, opcional:
   > utilizar Module Federation). No mínimo duas funcionalidades/telas do
   > projeto PJBL. No repo deve conter um arquivo GRUPO.md deve conter o
   > nome dos alunos. Comunicação do frontend com pelo menos 1 endpoint GET
   > de Azure Functions (utilizar dados mocks). [...] Utilizar IAG. Informe
   > no arquivo Prompt.md qual o prompt utilizado para gerar o frontend.
   > Publicar no Azure Web Static Apps. No arquivo Readme.MD deve conter o
   > endereço do site criado no azure web Static apps [...] Entregar um
   > arquivo MD com os nomes dos alunos no grupo; conter o link do GitHub
   > utilizado."

2. **Ajuste de stack** — *"vite? eu pedi next"* → a IA havia montado o
   frontend inicial com Vite; a pedido do grupo, foi refeito com **Next.js**
   (App Router).

3. **Ajuste de estilização** — *"next + tailwind"* → adição do **Tailwind
   CSS** ao projeto Next.js.

4. **Escopo completo e origem dos mocks** — *"faça o front completo
   conforme arquivo enviado.. e vamos usar os mocks tudo no datadog"*,
   esclarecido em seguida para **Apidog** (ferramenta de mock de API
   sugerida no PJBL, não o Datadog). A partir disso, a IA:
   - reconstruiu o frontend completo (login mock + 7 telas), replicando
     fielmente o protótipo `Ativos-TI-standalone.html`;
   - separou todos os dados mock em arquivos JSON isolados da lógica da
     aplicação, para que a origem dos mocks (Azure Function local ou
     Apidog) possa ser trocada via variável de ambiente, sem alterar
     código — ver `docs/apidog-import.md`.

5. **Migração para TypeScript** — *"java script? troque para typescript"*
   e *"nextjs + ts + tailwind"* → todo o frontend foi convertido de
   JavaScript para **TypeScript** (arquivos `.ts`/`.tsx`), com tipos
   compartilhados em `frontend/lib/types.ts` para as entidades do domínio
   (`Ativo`, `Colaborador`, `Alocacao`, `Manutencao`, `Usuario`,
   `DashboardData`).

6. **Componentização** — *"use componetização correta"* → os componentes
   foram reorganizados em camadas: `components/ui` (primitivos como
   `Button`, `Card`, `Badge`, `Input`, `Select`, `Table`, `Pagination`),
   `components/layout` (`Sidebar`, `Topbar`, `AppShell`, `LoginScreen`,
   `AuthGate`), `components/common` (peças reaproveitadas entre telas,
   como `PageHeader`, `InfoBanner`, `StatCard`, `BarcodeModal`) e uma
   pasta `components/<feature>` por tela, contendo apenas as tabelas e
   filtros específicos daquela tela. As páginas em `app/**/page.tsx`
   ficaram curtas, compondo esses componentes em vez de conter JSX extenso
   inline.

## O que foi gerado pela IA

- Frontend completo em `frontend/` (Next.js 16 + App Router + TypeScript +
  Tailwind CSS):
  - Tela de **login mock** (`components/layout/LoginScreen.tsx`), com
    sessão controlada por `lib/AuthContext.tsx`.
  - **Dashboard** (`app/page.tsx`) — indicadores gerenciais (RF35), usando
    `components/dashboard/*`.
  - **Ativos** (`app/ativos/page.tsx`) — listagem, busca, filtro e
    paginação (RF17), usando `components/ativos/*`.
  - **Colaboradores** (`app/colaboradores/page.tsx`) (RF09/RF12).
  - **Alocações** (`app/alocacoes/page.tsx`), com devolução simulada
    (RF21/RF22).
  - **Manutenções** (`app/manutencoes/page.tsx`) (RF27-RF31).
  - **Relatórios** (`app/relatorios/page.tsx`), com exportação CSV
    (RF32-RF36).
  - **Usuários e Permissões** (`app/usuarios/page.tsx`) e matriz de
    permissões (RF06/RF07).
  - Camada de layout: `components/layout/AppShell.tsx` (sidebar agrupada +
    topbar) e `components/common/BarcodeModal.tsx` (leitura de código
    manual, RF19/RF20/RF26).
  - Primitivos de UI reutilizáveis em `components/ui/` (Button, Card,
    Badge, Input, Select, Table, Pagination) e tipos compartilhados em
    `lib/types.ts`.
- Mock backend em Azure Functions (`api/`), com seis endpoints GET
  (`/dashboard`, `/ativos`, `/colaboradores`, `/alocacoes`,
  `/manutencoes`, `/usuarios`), dados isolados em `api/src/data/*.json`.
- Workflow de deploy para o Azure Static Web Apps
  (`.github/workflows/azure-static-web-apps.yml`).
- Documentação: `GRUPO.md`, `README.md`, `docs/apidog-import.md` e este
  `Prompt.md`.

Todo o código gerado foi revisado, testado localmente (build do Next.js,
execução dos endpoints mock e navegação por todas as telas com testes
automatizados de ponta a ponta) e ajustado pelo grupo antes da entrega.
