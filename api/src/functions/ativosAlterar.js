const { app } = require("@azure/functions");
const { getAtivosCollection } = require("../lib/mongo");

const STATUS_VALIDOS = ["Em estoque", "Em uso", "Em manutenção", "Baixado"];
const CAMPOS_EDITAVEIS = [
  "tipo",
  "marca",
  "modelo",
  "numeroSerie",
  "status",
  "colaborador",
  "setor",
  "dataAquisicao",
  "valorAquisicao",
];

// PUT /api/ativos/{numeroPatrimonio}
// Altera um ativo existente no MongoDB Atlas (RF13/RF17).
// O número de patrimônio identifica o ativo e não pode ser alterado por aqui.
app.http("ativosAlterar", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "ativos/{numeroPatrimonio}",
  handler: async (request, context) => {
    const { numeroPatrimonio } = request.params;
    context.log(`PUT /api/ativos/${numeroPatrimonio}`);

    try {
      const body = await request.json().catch(() => ({}));

      if (body.status && !STATUS_VALIDOS.includes(body.status)) {
        return {
          status: 400,
          jsonBody: { error: `status inválido. Use um de: ${STATUS_VALIDOS.join(", ")}.` },
          headers: { "Content-Type": "application/json" },
        };
      }

      const atualizacoes = {};
      for (const campo of CAMPOS_EDITAVEIS) {
        if (body[campo] !== undefined) {
          atualizacoes[campo] = campo === "valorAquisicao" ? Number(body[campo]) : body[campo];
        }
      }

      if (Object.keys(atualizacoes).length === 0) {
        return {
          status: 400,
          jsonBody: { error: "Nenhum campo válido para atualizar foi enviado." },
          headers: { "Content-Type": "application/json" },
        };
      }

      const colecao = await getAtivosCollection();
      const resultado = await colecao.findOneAndUpdate(
        { numeroPatrimonio },
        { $set: atualizacoes },
        { returnDocument: "after", projection: { _id: 0 } }
      );

      if (!resultado) {
        return {
          status: 404,
          jsonBody: { error: `Nenhum ativo encontrado com o patrimônio ${numeroPatrimonio}.` },
          headers: { "Content-Type": "application/json" },
        };
      }

      return {
        status: 200,
        jsonBody: resultado,
        headers: { "Content-Type": "application/json" },
      };
    } catch (error) {
      context.error("Erro ao alterar ativo no MongoDB:", error);
      return {
        status: 500,
        jsonBody: { error: error.message },
        headers: { "Content-Type": "application/json" },
      };
    }
  },
});
