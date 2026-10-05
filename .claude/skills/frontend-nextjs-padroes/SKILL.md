---
name: frontend-nextjs-padroes
description: Padrões do frontend Next.js (TypeScript + Tailwind) do sistema de ativos de TI — organização de pastas, componentes por camada, consumo da API via proxy/gateway e tratamento de estado. Use ao criar ou alterar telas e componentes em frontend/.
---

# Frontend Next.js — padrões

## Organização (já existente em `frontend/`)
- `app/<rota>/page.tsx` — uma página por rota (App Router). Páginas orquestram estado e chamadas à API; **não** contêm marcação reutilizável.
- `components/ui/` — primitivos visuais sem regra de negócio (`Button`, `Card`, `Input`, `Select`, `Table`, `Badge`, `Pagination`). Futuro pacote `design-system` (ver skill `design-system-pacote`).
- `components/layout/` — estrutura da aplicação (`AppShell`, `Sidebar`, `Topbar`, `AuthGate`).
- `components/common/` — blocos compartilhados com semântica (`PageHeader`, `StatCard`, `ConfirmDialog`, `DataState`).
- `components/<feature>/` — componentes de uma funcionalidade (`ativos/AtivosTable`, `ativos/AtivoFormModal`...).
- `lib/` — `api.ts` (única porta de saída HTTP), `types.ts` (contrato), `format.ts`, `csv.ts`, `AuthContext.tsx`.

## Consumo da API (Frontend → Proxy → API Gateway → Backend)
- **Toda** chamada HTTP passa por `lib/api.ts`. Componentes nunca usam `fetch` direto.
- A base é `NEXT_PUBLIC_API_BASE_URL` ou `"/api"`. Em desenvolvimento com o backend Kotlin: `npm run dev:backend` (o Next encaminha `/api/*` ao Gateway em `http://localhost:8080`).
- Sem `GATEWAY_URL` o projeto continua exportando site estático para o Azure Static Web Apps.
- Tipos de requisição/resposta vivem em `lib/types.ts` e **espelham os DTOs do backend**; mudou o DTO, muda o tipo.
- Erros: o backend responde `{ "error": "..." }`; `api.ts` converte em `Error(message)` e a página exibe com `ErrorMsg`.

## Convenções de componente
- Um componente por arquivo, `export default`, nome em PascalCase igual ao arquivo.
- Props tipadas com `interface <Nome>Props`; sem `any`.
- Páginas com dados usam `"use client"`, `useEffect` + `useCallback` e os estados `Loading` / `ErrorMsg` de `DataState`.
- Estilo: Tailwind com as variáveis CSS de `app/globals.css` (`var(--blue)`, `var(--border)`...). Nunca cor hexadecimal solta em componente.
- Formatação de moeda/data somente via `lib/format.ts`.
- Ações destrutivas sempre com `ConfirmDialog`.

## Checklist
1. `npm run lint` e `npm run build` sem erro. 2. Nenhum `fetch` fora de `lib/api.ts`. 3. Tipos em `lib/types.ts` batem com o backend.
