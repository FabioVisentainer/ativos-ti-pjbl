const { app } = require("@azure/functions");
const manutencoes = require("../data/manutencoes.json");

// GET /api/manutencoes
// Retorna o histórico de manutenções registradas, com o custo de cada serviço (RF27-RF31).
app.http("manutencoes", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "manutencoes",
  handler: async (request, context) => {
    context.log("GET /api/manutencoes");

    return {
      status: 200,
      jsonBody: manutencoes,
      headers: { "Content-Type": "application/json" },
    };
  },
});
