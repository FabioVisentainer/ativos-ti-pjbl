const { app } = require("@azure/functions");
const { getAtivosCollection } = require("../lib/mongo");

// GET /api/ativos?busca=&status=
// Pesquisa ativos de TI no MongoDB Atlas (RF13/RF17).
// - "busca": procura em numeroPatrimonio, numeroSerie, tipo, marca, modelo, colaborador
// - "status": filtra por um dos valores de StatusAtivo
app.http("ativosPesquisar", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "ativos",
  handler: async (request, context) => {
    context.log("GET /api/ativos");

    try {
      const busca = (request.query.get("busca") || "").trim();
      const status = request.query.get("status");

      const filtro = {};
      if (status && status !== "Todos") {
        filtro.status = status;
      }
      if (busca) {
        const regex = { $regex: busca, $options: "i" };
        filtro.$or = [
          { numeroPatrimonio: regex },
          { numeroSerie: regex },
          { tipo: regex },
          { marca: regex },
          { modelo: regex },
          { colaborador: regex },
        ];
      }

      const colecao = await getAtivosCollection();
      const ativos = await colecao.find(filtro, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();

      return {
        status: 200,
        jsonBody: ativos,
        headers: { "Content-Type": "application/json" },
      };
    } catch (error) {
      context.error("Erro ao pesquisar ativos no MongoDB:", error);
      return {
        status: 500,
        jsonBody: { error: error.message },
        headers: { "Content-Type": "application/json" },
      };
    }
  },
});
