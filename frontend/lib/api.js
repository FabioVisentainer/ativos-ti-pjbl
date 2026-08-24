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
// Se preferir mockar com o Apidog em vez de rodar a Azure Function local,
// crie um arquivo .env.local na pasta frontend/ com:
//   NEXT_PUBLIC_API_BASE_URL=https://<seu-mock>.apidog.io
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

async function get(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao consultar ${path}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/** GET /api/ativos — lista de ativos de TI (dados mock). */
export function getAtivos() {
  return get("/ativos");
}

/** GET /api/dashboard — indicadores gerenciais (dados mock). */
export function getDashboard() {
  return get("/dashboard");
}
