# Sistema de Controle de Ativos de Informática — Projeto PJBL

Frontend completo em Next.js (login mock + 7 telas) que se comunica com
Azure Functions (mock) para gerenciar o parque de ativos de TI de uma
empresa (notebooks, monitores, periféricos etc.). Projeto desenvolvido para
a disciplina de PJBL, replicando o protótipo funcional do sistema.

- **Site publicado (Azure Static Web Apps):** `<< PREENCHER APÓS O DEPLOY >>`
- **Grupo:** ver [`GRUPO.md`](./GRUPO.md)
- **Prompt de IA utilizado para gerar o frontend:** ver [`Prompt.md`](./Prompt.md)
- **Como importar os mocks no Apidog:** ver [`docs/apidog-import.md`](./docs/apidog-import.md)

## Funcionalidades / telas

1. **Login (SSO mock)** — tela inicial simulando o login corporativo via
   Microsoft Entra ID (RF05). Não há senha: basta clicar em "Entrar com
   conta corporativa".
2. **Dashboard** (`/`) — indicadores gerenciais: total de ativos, em uso,
   em manutenção, custo de manutenção acumulado, distribuição por status,
   custo de manutenção por mês e últimas movimentações (RF35).
3. **Ativos** (`/ativos`) — listagem com busca, filtro por status e
   paginação (RF13/RF17). Também recebe o resultado do modal "Ler código".
4. **Colaboradores** (`/colaboradores`) — cadastro de colaboradores com
   contagem de ativos alocados (RF09/RF12).
5. **Alocações** (`/alocacoes`) — alocações ativas, com ação de devolução
   simulada na sessão do navegador (RF21/RF22/RF25).
6. **Manutenções** (`/manutencoes`) — histórico de manutenções, custo total
   e custo médio por serviço (RF27-RF31).
7. **Relatórios** (`/relatorios`) — relatórios de ativos por status, ativos
   por setor e custo de manutenção por tipo/período, com exportação em CSV
   (RF32-RF36).
8. **Usuários e Permissões** (`/usuarios`) — usuários do sistema e matriz de
   permissões por perfil (RF06/RF07).

O botão **"Ler código"** no topo abre um modal para digitar um número de
patrimônio manualmente (RF19/RF20/RF26). A leitura via câmera do
dispositivo (`getUserMedia`) é o próximo passo natural de evolução — não foi
implementada aqui porque exige teste em dispositivo real com HTTPS.

## Stack

- **Frontend:** Next.js 16 (App Router) + **TypeScript** + Tailwind CSS,
  exportado como site estático (`output: 'export'`) para publicação no
  Azure Static Web Apps. Ícones via `lucide-react`. Tipos compartilhados em
  `frontend/lib/types.ts` (`Ativo`, `Colaborador`, `Alocacao`, `Manutencao`,
  `Usuario`, `DashboardData`).
- **Backend (mock):** Azure Functions (Node.js, modelo de programação v4),
  com seis endpoints GET. Os dados mock ficam isolados em arquivos JSON
  (`api/src/data/`), separados da lógica — ver
  [`docs/apidog-import.md`](./docs/apidog-import.md) para usar o Apidog no
  lugar da Function local, sem alterar código.

## Endpoints GET disponíveis

| Rota                 | Descrição                                              |
| --------------------- | ------------------------------------------------------- |
| `GET /api/dashboard`  | Indicadores consolidados (calculado a partir dos outros) |
| `GET /api/ativos`     | Lista de ativos de TI                                   |
| `GET /api/colaboradores` | Colaboradores + contagem de ativos alocados          |
| `GET /api/alocacoes`  | Alocações ativas                                        |
| `GET /api/manutencoes`| Histórico de manutenções                                |
| `GET /api/usuarios`   | Usuários do sistema e perfis                            |

## Estrutura do repositório

```
ativos-ti-pjbl/
├── frontend/                     # aplicação Next.js (TypeScript)
│   ├── app/                       # rotas: /, /ativos, /colaboradores, /alocacoes,
│   │                               #   /manutencoes, /relatorios, /usuarios
│   ├── components/
│   │   ├── ui/                    # primitivos: Button, Card, Badge, Input,
│   │   │                          #   Select, Table, Pagination
│   │   ├── layout/                # Sidebar, Topbar, AppShell, LoginScreen, AuthGate
│   │   ├── common/                # PageHeader, InfoBanner, StatCard, DataState,
│   │   │                          #   BarcodeModal
│   │   └── <feature>/             # tabelas e filtros específicos de cada tela
│   │       (ativos, colaboradores, alocacoes, manutencoes, relatorios, usuarios,
│   │        dashboard)
│   └── lib/                       # api.ts, types.ts, format.ts, csv.ts, AuthContext.tsx
├── api/                          # Azure Functions (mock)
│   ├── src/functions/             # lógica de cada rota GET
│   └── src/data/                  # dados mock (JSON), isolados da lógica
├── docs/apidog-import.md         # como usar o Apidog no lugar da Function local
├── .github/workflows/            # pipeline de deploy para o Azure Static Web Apps
├── GRUPO.md
├── Prompt.md
└── README.md
```

A UI segue uma componentização em camadas: `components/ui` tem apenas
primitivos visuais sem lógica de negócio; `components/layout` monta a
casca da aplicação (sidebar, topbar, login); `components/common` reúne
peças reaproveitadas por várias telas; e cada pasta `components/<feature>`
contém só o que é específico daquela tela (tabela, filtros). As páginas em
`app/**/page.tsx` ficam curtas — apenas buscam os dados da API e compõem
esses componentes.

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
  (`npm install -g azure-functions-core-tools@4 --unsafe-perm true`) — apenas
  se for rodar a Azure Function localmente.

### 1. Backend (Azure Function mock)

```bash
cd api
npm install
cp local.settings.json.example local.settings.json
npm start        # inicia em http://localhost:7071
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # inicia em http://localhost:3000
```

Por padrão o frontend chama `/api/...` (caminho relativo). Para apontar o
frontend, em desenvolvimento, diretamente para a Function local ou para o
mock do Apidog, crie um arquivo `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071/api
# ou, usando Apidog como mock (ver docs/apidog-import.md):
# NEXT_PUBLIC_API_BASE_URL=<< URL do mock no Apidog >>
```

> Alternativa recomendada para rodar frontend + API juntos localmente, do
> jeito mais parecido com a produção: usar a
> [Azure Static Web Apps CLI](https://learn.microsoft.com/azure/static-web-apps/local-development)
> (`swa start frontend/out --api-location api`), que já faz o proxy de
> `/api` para a Function local.

## Deploy no Azure Static Web Apps

1. Suba este repositório para o GitHub (branch `main`).
2. No [Portal do Azure](https://portal.azure.com), crie um recurso **Static
   Web App**, conectado a este repositório/branch, com:
   - **App location:** `/frontend`
   - **Api location:** `/api`
   - **Output location:** `out`
3. O Azure cria automaticamente um workflow do GitHub Actions e o segredo
   `AZURE_STATIC_WEB_APPS_API_TOKEN` no repositório — o workflow já incluso
   em [`.github/workflows/azure-static-web-apps.yml`](./.github/workflows/azure-static-web-apps.yml)
   usa esse segredo.
4. Após o primeiro deploy, copie a URL gerada (ex.:
   `https://<nome-gerado>.azurestaticapps.net`) e atualize:
   - o topo deste `README.md`;
   - a entrega no AVA, junto com o link do repositório do GitHub.

## Mock com Apidog

Este projeto usa o Apidog como origem dos mocks (ver passo a passo completo
em [`docs/apidog-import.md`](./docs/apidog-import.md)). Os 6 endpoints GET
(`/ativos`, `/colaboradores`, `/alocacoes`, `/manutencoes`, `/usuarios`,
`/dashboard`) já estão publicados como mock no Apidog:

- **URL base do mock no Apidog:** `https://mock.apidog.com/m1/1367360-1371779-default`

Para o frontend consumir o Apidog em vez da Azure Function local, crie
`frontend/.env.local` com:

```bash
NEXT_PUBLIC_API_BASE_URL=https://mock.apidog.com/m1/1367360-1371779-default
```
