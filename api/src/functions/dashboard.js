const { app } = require("@azure/functions");
const ativos = require("../data/ativos.json");
const manutencoes = require("../data/manutencoes.json");
const movimentacoes = require("../data/movimentacoes.json");

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function buildDashboard() {
  const contarPorStatus = (status) =>
    ativos.filter((a) => a.status === status).length;

  const custoManutencaoAcumulado = manutencoes.reduce(
    (total, m) => total + m.custo,
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

  const custoPorMes = {};
  for (const m of manutencoes) {
    const mesIndex = new Date(m.data + "T00:00:00").getMonth();
    const label = MESES[mesIndex];
    custoPorMes[label] = (custoPorMes[label] || 0) + m.custo;
  }
  // Mantém a ordem cronológica dos meses que efetivamente têm manutenção.
  const custoManutencaoPorMes = MESES
    .map((mes) => ({ mes, valor: custoPorMes[mes] || 0 }))
    .filter((item) => item.valor > 0);

  return {
    totalAtivos: ativos.length,
    emUso: contarPorStatus("Em uso"),
    emEstoque: contarPorStatus("Em estoque"),
    emManutencao: contarPorStatus("Em manutenção"),
    baixados: contarPorStatus("Baixado"),
    custoManutencaoAcumulado,
    ativosPorSetor,
    custoManutencaoPorMes,
    ultimasMovimentacoes: movimentacoes,
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
