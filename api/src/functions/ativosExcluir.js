const { app } = require("@azure/functions");
const { getAtivosCollection } = require("../lib/mongo");

// DELETE /api/ativos/{numeroPatrimonio}
// Remove um ativo do MongoDB Atlas (baixa definitiva do cadastro).
app.http("ativosExcluir", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "ativos/{numeroPatrimonio}",
  handler: async (request, context) => {
    const { numeroPatrimonio } = request.params;
    context.log(`DELETE /api/ativos/${numeroPatrimonio}`);

    try {
      const colecao = await getAtivosCollection();
      const resultado = await colecao.deleteOne({ numeroPatrimonio });

      if (resultado.deletedCount === 0) {
        return {
          status: 404,
          jsonBody: { error: `Nenhum ativo encontrado com o patrimônio ${numeroPatrimonio}.` },
          headers: { "Content-Type": "application/json" },
        };
      }

      return {
        status: 200,
        jsonBody: { mensagem: `Ativo ${numeroPatrimonio} excluído com sucesso.` },
        headers: { "Content-Type": "application/json" },
      };
    } catch (error) {
      context.error("Erro ao excluir ativo no MongoDB:", error);
      return {
        status: 500,
        jsonBody: { error: error.message },
        headers: { "Content-Type": "application/json" },
      };
    }
  },
});
