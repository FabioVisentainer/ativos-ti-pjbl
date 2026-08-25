# Importando os mocks no Apidog

Todos os dados mock deste projeto ficam isolados em arquivos JSON dentro de
`api/src/data/`, separados da lógica das Azure Functions. Isso permite usar
o Apidog como origem dos mocks **sem alterar nenhum código** — o frontend já
lê a URL base da API de uma variável de ambiente
(`NEXT_PUBLIC_API_BASE_URL`, em `frontend/lib/api.js`).

## Passo a passo

1. Crie um projeto no [Apidog](https://apidog.com/pt-BR/).
2. Para cada endpoint abaixo, crie uma rota **GET** com o mesmo caminho e
   cole o conteúdo do arquivo JSON correspondente como corpo da resposta
   mock (Apidog gera o schema automaticamente a partir do JSON colado):

   | Rota                  | Arquivo fonte                          |
   | ---------------------- | --------------------------------------- |
   | `GET /ativos`          | `api/src/data/ativos.json`              |
   | `GET /colaboradores`   | `api/src/data/colaboradores.json` *     |
   | `GET /alocacoes`       | `api/src/data/alocacoes.json`           |
   | `GET /manutencoes`     | `api/src/data/manutencoes.json`         |
   | `GET /usuarios`        | `api/src/data/usuarios.json`            |
   | `GET /dashboard`       | ver nota abaixo                         |

   \* No backend, `/colaboradores` combina `colaboradores.json` com a
   contagem de ativos alocados (calculada a partir de `ativos.json`). Para
   reproduzir isso como mock estático no Apidog, gere o JSON já combinado
   localmente (rode a Azure Function uma vez e copie a resposta de
   `GET /api/colaboradores`) e cole esse resultado no Apidog.

3. Para `/dashboard`, o valor também é calculado (indicadores, agregações
   por setor/mês) em vez de estático. Rode a Function localmente
   (`cd api && npm install && npm start`), acesse
   `http://localhost:7071/api/dashboard`, copie o JSON retornado e cole
   como resposta mock da rota `GET /dashboard` no Apidog.
4. Publique o mock e copie a URL base gerada pelo Apidog (algo como
   `https://mock.apidog.com/m1/xxxxxxx`).
5. No frontend, crie `frontend/.env.local` com:

   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://mock.apidog.com/m1/xxxxxxx
   ```

6. Rode `npm run dev` na pasta `frontend/` — o app passa a consumir os
   endpoints do Apidog automaticamente, sem nenhuma mudança de código.
7. Anote a URL do mock do Apidog no `README.md` (seção "Mock com Apidog").

## Por que os dados ficam em arquivos separados

- `api/src/functions/*.js` contém apenas a lógica (rota, agregações);
- `api/src/data/*.json` contém apenas os dados mock;
- `frontend/lib/api.js` não conhece a origem dos dados — só sabe o caminho
  (`/ativos`, `/dashboard` etc.) e lê a URL base de uma env var.

Essa separação é o que permite trocar "Azure Function local" por "Apidog"
(ou qualquer outro mock) sem tocar em nenhuma linha de código de aplicação.
