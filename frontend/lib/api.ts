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
  Colaborador,
  Alocacao,
  Manutencao,
  Usuario,
  DashboardData,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao consultar ${path}: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

/** GET /api/dashboard — indicadores gerenciais consolidados (RF35). */
export function getDashboard(): Promise<DashboardData> {
  return get<DashboardData>("/dashboard");
}

/** GET /api/ativos — lista de ativos de TI cadastrados (RF13/RF17). */
export function getAtivos(): Promise<Ativo[]> {
  return get<Ativo[]>("/ativos");
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
