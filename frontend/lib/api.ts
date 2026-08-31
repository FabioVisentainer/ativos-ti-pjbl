// Camada de comunicação do frontend com o backend (Azure Functions).
//
// Em produção, o Azure Static Web Apps expõe a Azure Function vinculada ao
// projeto sob o mesmo domínio, em /api/*, então o valor padrão "/api"
// funciona sem nenhuma configuração extra.
//
// Para desenvolvimento local com a Azure Functions Core Tools + SWA CLI
// (`swa start`), o mesmo caminho relativo "/api" também funciona, pois a
// SWA CLI faz o proxy entre o frontend (Next.js) e a Function local.
//
// Para usar o Apidog (ou qualquer outro mock) no lugar da Azure Function
// local, sem alterar nenhum código, basta criar um arquivo .env.local em
// frontend/ com:
//   NEXT_PUBLIC_API_BASE_URL=https://<seu-mock>.apidog.io
// Passo a passo completo em docs/apidog-import.md.
import type {
  Ativo,
  AtivoEditavel,
  NovoAtivo,
  Colaborador,
  Alocacao,
  Manutencao,
  Usuario,
  DashboardData,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function parseErro(response: Response): Promise<string> {
  try {
    const corpo = await response.json();
    if (corpo && typeof corpo.error === "string") return corpo.error;
  } catch {
    // resposta sem corpo JSON — usa a mensagem padrão abaixo
  }
  return `${response.status} ${response.statusText}`;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar ${path}: ${await parseErro(response)}`);
  }

  return response.json() as Promise<T>;
}

/** POST/PUT/DELETE com corpo JSON opcional — usado pelas mutações de Ativos. */
async function send<T>(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Falha ao ${method} ${path}: ${await parseErro(response)}`);
  }

  return response.json() as Promise<T>;
}

/** GET /api/dashboard — indicadores gerenciais consolidados (RF35). */
export function getDashboard(): Promise<DashboardData> {
  return get<DashboardData>("/dashboard");
}

/** GET /api/ativos — pesquisa ativos de TI cadastrados no MongoDB (RF13/RF17). */
export function getAtivos(): Promise<Ativo[]> {
  return get<Ativo[]>("/ativos");
}

/** POST /api/ativos — insere um novo ativo no MongoDB (RF13). */
export function inserirAtivo(novoAtivo: NovoAtivo): Promise<Ativo> {
  return send<Ativo>("POST", "/ativos", novoAtivo);
}

/** PUT /api/ativos/{numeroPatrimonio} — altera um ativo existente no MongoDB (RF13). */
export function alterarAtivo(
  numeroPatrimonio: string,
  alteracoes: AtivoEditavel
): Promise<Ativo> {
  return send<Ativo>(
    "PUT",
    `/ativos/${encodeURIComponent(numeroPatrimonio)}`,
    alteracoes
  );
}

/** DELETE /api/ativos/{numeroPatrimonio} — exclui um ativo do MongoDB (RF13). */
export function excluirAtivo(
  numeroPatrimonio: string
): Promise<{ mensagem: string }> {
  return send<{ mensagem: string }>(
    "DELETE",
    `/ativos/${encodeURIComponent(numeroPatrimonio)}`
  );
}

/** GET /api/colaboradores — colaboradores cadastrados (RF09/RF12). */
export function getColaboradores(): Promise<Colaborador[]> {
  return get<Colaborador[]>("/colaboradores");
}

/** GET /api/alocacoes — alocações ativas de ativos a colaboradores (RF21/RF25). */
export function getAlocacoes(): Promise<Alocacao[]> {
  return get<Alocacao[]>("/alocacoes");
}

/** GET /api/manutencoes — histórico de manutenções e custos (RF27-RF31). */
export function getManutencoes(): Promise<Manutencao[]> {
  return get<Manutencao[]>("/manutencoes");
}

/** GET /api/usuarios — usuários do sistema e seus perfis (RF06/RF07). */
export function getUsuarios(): Promise<Usuario[]> {
  return get<Usuario[]>("/usuarios");
}
