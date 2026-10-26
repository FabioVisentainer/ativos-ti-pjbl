---
name: design-system-pacote
description: Padrão do design system do frontend como pacote separado (packages/design-system) — tokens, componentes reutilizáveis, versionamento e consumo pelo app Next.js. Use ao criar, mover ou alterar componentes visuais genéricos.
---

# Design System — pacote separado

## Objetivo
Isolar tokens e componentes visuais genéricos em `packages/design-system` (pacote `@ativos/design-system`), consumido pelo app em `frontend/`. O app **não** define aparência de primitivos; ele só os usa.

## Estrutura alvo
```
packages/design-system/
├── package.json            # name: "@ativos/design-system", "type": "module", peer: react
├── tsconfig.json
└── src/
    ├── index.ts            # única API pública (re-exporta tokens e componentes)
    ├── tokens/
    │   ├── colors.ts       # espelha as variáveis de frontend/app/globals.css
    │   ├── spacing.ts
    │   └── typography.ts
    ├── styles/tokens.css   # :root { --navy, --blue, --bg, --surface, --text, --border, --success, --warning, --danger }
    └── components/
        ├── Button.tsx  Card.tsx  Input.tsx  Select.tsx
        ├── Table.tsx   Badge.tsx Pagination.tsx
        └── <Componente>.stories.tsx (opcional)
```
Origem: mover `frontend/components/ui/*` e as variáveis `:root` de `frontend/app/globals.css`.

## Regras
1. **Só entra no pacote** o que é genérico: sem import de `lib/api`, sem tipos de domínio (`Ativo`, `Colaborador`), sem texto de negócio.
2. Tokens são a única fonte de cor/espaço/tipografia; componentes usam `var(--token)`, nunca valores soltos.
3. Cada componente: props tipadas, `className` repassável, variantes por `Record<Variant, string>` (padrão atual de `Button`), acessível (`aria-*`, foco visível).
4. API pública apenas por `src/index.ts`; o app importa `import { Button } from "@ativos/design-system"`.
5. Mudança visível = versão do pacote (semver). Quebra de prop = major.

## Consumo no app
- Monorepo com npm workspaces na raiz: `"workspaces": ["frontend", "packages/*"]`.
- `frontend/package.json`: dependência `"@ativos/design-system": "*"`.
- `frontend/next.config.ts`: `transpilePackages: ["@ativos/design-system"]`.
- `frontend/app/globals.css`: `@import "@ativos/design-system/styles/tokens.css";`.

## Checklist
1. Componente novo é genérico e tem variantes tipadas. 2. Exportado em `index.ts`. 3. Sem dependência do domínio. 4. `npm run build` do app passa.
