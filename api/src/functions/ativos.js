const { app } = require("@azure/functions");
const ativos = require("../data/ativos.json");

// GET /api/ativos
// Retorna a lista de ativos de TI cadastrados (dados mock, RF13/RF17).
app.http("ativos", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "ativos",
  handler: async (request, context) => {
    context.log("GET /api/ativos");

    return {
      status: 200,
      jsonBody: ativos,
      headers: { "Content-Type": "application/json" },
    };
  },
});
