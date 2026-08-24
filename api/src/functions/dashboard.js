const { app } = require("@azure/functions");
const ativos = require("../data/ativos.json");

function buildDashboard() {
  const contarPorStatus = (status) =>
    ativos.filter((a) => a.status === status).length;

  const custoManutencaoAcumulado = ativos.reduce(
    (total, a) => total + (a.custoManutencao || 0),
    0
  );

  const porSetor = {};
  for (const ativo of ativos) {
    if (!ativo.setor) continue;
    porSetor[ativo.setor] = (porSetor[ativo.setor] || 0) + 1;
  }

  const ativosPorSetor = Object.entries(porSetor)
    .map(([setor, quantidade]) => ({ setor, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

  return {
    totalAtivos: ativos.length,
    emUso: contarPorStatus("Em uso"),
    emEstoque: contarPorStatus("Em estoque"),
    emManutencao: contarPorStatus("Em manutenção"),
    baixados: contarPorStatus("Baixado"),
    custoManutencaoAcumulado,
    ativosPorSetor,
  };
}

// GET /api/dashboard
// Retorna indicadores gerenciais consolidados a partir dos ativos (RF35).
app.http("dashboard", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "dashboard",
  handler: async (request, context) => {
    context.log("GET /api/dashboard");

    return {
      status: 200,
      jsonBody: buildDashboard(),
      headers: { "Content-Type": "application/json" },
    };
  },
});
