const { app } = require("@azure/functions");
const colaboradores = require("../data/colaboradores.json");
const ativos = require("../data/ativos.json");

// GET /api/colaboradores
// Retorna os colaboradores cadastrados, com a contagem de ativos alocados (RF09/RF12).
app.http("colaboradores", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "colaboradores",
  handler: async (request, context) => {
    context.log("GET /api/colaboradores");

    const resultado = colaboradores.map((c) => ({
      ...c,
      ativosAlocados: ativos.filter((a) => a.colaborador === c.nome).length,
    }));

    return {
      status: 200,
      jsonBody: resultado,
      headers: { "Content-Type": "application/json" },
    };
  },
});
