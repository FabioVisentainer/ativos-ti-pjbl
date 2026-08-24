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
- Um protótipo visual estático previamente gerado (`Ativos-TI-standalone.html`).

## Prompt principal

> "Em grupo PJBL, alunos criam frontend que se comunica com azure functions e
> mock backend. (Opcional: utilizar React, opcional: utilizar Module
> Federation). No mínimo duas funcionalidades/telas do projeto PJBL. No repo
> deve conter um arquivo GRUPO.md deve conter o nome dos alunos. Comunicação
> do frontend com pelo menos 1 endpoint GET de Azure Functions (utilizar
> dados mocks). [...] Utilizar IAG. Informe no arquivo Prompt.md qual o
> prompt utilizado para gerar o frontend. Publicar no Azure Web Static Apps.
> No arquivo Readme.MD deve conter o endereço do site criado no azure web
> Static apps [...] Entregar um arquivo MD com os nomes dos alunos no grupo;
> conter o link do GitHub utilizado."

A partir desse prompt inicial (o enunciado do PJBL colado diretamente na
conversa), a IA foi orientada, em prompts de acompanhamento, a:

1. Montar o repositório completo do projeto a partir do enunciado acima,
   reaproveitando o protótipo e os documentos de requisitos já existentes na
   pasta do projeto.
2. Trocar o stack inicialmente sugerido (Vite) para **Next.js**, conforme
   pedido: *"vite? eu pedi next"*.
3. Adicionar **Tailwind CSS** ao projeto Next.js, conforme pedido:
   *"next + tailwind"*.

## O que foi gerado pela IA

Com base nesses prompts, a IA gerou:

- A estrutura completa do frontend em `frontend/` (Next.js 16 + App Router +
  Tailwind CSS), incluindo:
  - Tela **Dashboard** (`frontend/app/page.js`) com indicadores gerenciais
    (RF35).
  - Tela **Ativos de TI** (`frontend/app/ativos/page.js`) com listagem,
    busca e filtro por status (RF17).
  - Camada de comunicação com a API (`frontend/lib/api.js`).
  - Componentes de layout e UI (`frontend/components/`).
- O mock backend em Azure Functions (`api/`), com os endpoints:
  - `GET /api/ativos`
  - `GET /api/dashboard`
- O workflow de deploy para o Azure Static Web Apps
  (`.github/workflows/azure-static-web-apps.yml`).
- Os arquivos de apoio `GRUPO.md`, `README.md` e este `Prompt.md`.

Todo o código gerado foi revisado, testado localmente (build do Next.js e
execução dos endpoints mock) e ajustado pelo grupo antes da entrega.
