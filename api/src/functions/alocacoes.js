const { app } = require("@azure/functions");
const alocacoes = require("../data/alocacoes.json");

// GET /api/alocacoes
// Retorna as alocações ativas (ativos atualmente em posse de colaboradores) — RF21/RF25.
app.http("alocacoes", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "alocacoes",
  handler: async (request, context) => {
    context.log("GET /api/alocacoes");

    return {
      status: 200,
      jsonBody: alocacoes,
      headers: { "Content-Type": "application/json" },
    };
  },
});
