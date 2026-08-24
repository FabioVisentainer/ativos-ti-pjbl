# Sistema de Controle de Ativos de Informática — Projeto PJBL

Frontend em Next.js que se comunica com uma Azure Function (mock) para
gerenciar o parque de ativos de TI de uma empresa (notebooks, monitores,
periféricos etc.). Projeto desenvolvido para a disciplina de PJBL.

- **Site publicado (Azure Static Web Apps):** `<< PREENCHER APÓS O DEPLOY >>`
- **Grupo:** ver [`GRUPO.md`](./GRUPO.md)
- **Prompt de IA utilizado para gerar o frontend:** ver [`Prompt.md`](./Prompt.md)

## Funcionalidades / telas

1. **Dashboard** (`/`) — indicadores gerenciais (total de ativos, em uso, em
   manutenção, baixados, custo de manutenção acumulado, ativos por setor).
   Consome `GET /api/dashboard`.
2. **Ativos de TI** (`/ativos`) — listagem de ativos cadastrados, com busca e
   filtro por status. Consome `GET /api/ativos`.

## Stack

- **Frontend:** Next.js 16 (App Router) + React + Tailwind CSS, exportado
  como site estático (`output: 'export'`) para publicação no Azure Static
  Web Apps.
- **Backend (mock):** Azure Functions (Node.js, modelo de programação v4),
  com dois endpoints GET retornando dados mock em memória.

## Estrutura do repositório

```
ativos-ti-pjbl/
├── frontend/          # aplicação Next.js
│   ├── app/            # rotas (Dashboard, Ativos)
│   ├── components/      # componentes de UI (Sidebar, StatCard, StatusBadge)
│   └── lib/api.js       # camada de comunicação com a API
├── api/                # Azure Functions (mock)
│   └── src/functions/   # ativos.js (GET /api/ativos), dashboard.js (GET /api/dashboard)
├── .github/workflows/   # pipeline de deploy para o Azure Static Web Apps
├── GRUPO.md
├── Prompt.md
└── README.md
```

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

Endpoints disponíveis:

- `GET http://localhost:7071/api/ativos`
- `GET http://localhost:7071/api/dashboard`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # inicia em http://localhost:3000
```

Por padrão o frontend chama `/api/...` (caminho relativo). Para apontar o
frontend, em desenvolvimento, diretamente para a Function local ou para um
mock do Apidog, crie um arquivo `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071/api
# ou, usando Apidog como mock:
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

## Mock com Apidog (opcional)

Os dois endpoints GET (`/api/ativos` e `/api/dashboard`) já são atendidos
pela Azure Function mock em `api/`. Caso o grupo opte por usar também o
[Apidog](https://apidog.com/pt-BR/) para mockar endpoints adicionais:

1. Importe os schemas de resposta de `api/src/data/ativos.json` e do objeto
   retornado por `buildDashboard()` em `api/src/functions/dashboard.js`.
2. Publique o mock no Apidog e liste os endereços aqui:
   - `<< endpoint mock 1 no Apidog >>`
   - `<< endpoint mock 2 no Apidog >>`
