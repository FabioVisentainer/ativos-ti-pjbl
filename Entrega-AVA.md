# Entrega PJBL — Sistema de Controle de Ativos de Informática

## Alunos do grupo

- Fabio Augusto Tomaselli Visentainer
- Mateus Zanettin Dall'Agnol
- Matheus Marcondes Muller
- Tiago Kasprzak Gorri

## Link do repositório GitHub

https://github.com/FabioVisentainer/ativos-ti-pjbl

## Link do site (Azure Static Web Apps)

`<< PREENCHER APÓS O DEPLOY >>`

## Azure Function (mock backend)

A Azure Function fica integrada ao Static Web App, publicada sob `/api` na
mesma URL do site (ex.: `https://<site>.azurestaticapps.net/api/...`).
Endpoints disponíveis, todos **GET**:

| Rota | Descrição |
| --- | --- |
| `GET /api/dashboard` | Indicadores gerenciais consolidados (total de ativos, em uso/estoque/manutenção/baixados, custo de manutenção acumulado, ativos por setor, custo de manutenção por mês, últimas movimentações) |
| `GET /api/ativos` | Lista de ativos de TI |
| `GET /api/colaboradores` | Colaboradores, com contagem de ativos alocados |
| `GET /api/alocacoes` | Alocações ativas |
| `GET /api/manutencoes` | Histórico de manutenções |
| `GET /api/usuarios` | Usuários do sistema e perfis |

Código-fonte de cada rota em `api/src/functions/`, dados mock isolados em
`api/src/data/` (ver [`README.md`](./README.md) para detalhes de stack e
estrutura do repositório).

## Mock com Apidog

Os mesmos 6 endpoints também estão publicados como mock no Apidog (com
"Exemplo de Resposta Primeiro" como prioridade, garantindo que os dados
reais do projeto sejam retornados em vez de dados aleatórios):

- **URL base:** `https://mock.apidog.com/m1/1367360-1371779-default`

| Rota completa | Equivalente na Azure Function |
| --- | --- |
| `https://mock.apidog.com/m1/1367360-1371779-default/ativos` | `GET /api/ativos` |
| `https://mock.apidog.com/m1/1367360-1371779-default/colaboradores` | `GET /api/colaboradores` |
| `https://mock.apidog.com/m1/1367360-1371779-default/alocacoes` | `GET /api/alocacoes` |
| `https://mock.apidog.com/m1/1367360-1371779-default/manutencoes` | `GET /api/manutencoes` |
| `https://mock.apidog.com/m1/1367360-1371779-default/usuarios` | `GET /api/usuarios` |
| `https://mock.apidog.com/m1/1367360-1371779-default/dashboard` | `GET /api/dashboard` |

Passo a passo de como os mocks foram configurados no Apidog:
[`docs/apidog-import.md`](./docs/apidog-import.md).
