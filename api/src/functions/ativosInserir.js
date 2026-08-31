const { app } = require("@azure/functions");
const { getAtivosCollection } = require("../lib/mongo");

const STATUS_VALIDOS = ["Em estoque", "Em uso", "Em manutenção", "Baixado"];

// POST /api/ativos
// Insere um novo ativo de TI no MongoDB Atlas (RF13/RF17).
// Corpo esperado (JSON): { tipo, marca, modelo, numeroPatrimonio, numeroSerie,
//   status, colaborador, setor, dataAquisicao, valorAquisicao }
app.http("ativosInserir", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "ativos",
  handler: async (request, context) => {
    context.log("POST /api/ativos");

    try {
      const body = await request.json().catch(() => ({}));

      if (!body.numeroPatrimonio || !body.tipo) {
        return {
          status: 400,
          jsonBody: { error: "Campos obrigatórios: numeroPatrimonio, tipo." },
          headers: { "Content-Type": "application/json" },
        };
      }

      const status = STATUS_VALIDOS.includes(body.status) ? body.status : "Em estoque";

      const colecao = await getAtivosCollection();

      const existente = await colecao.findOne({ numeroPatrimonio: body.numeroPatrimonio });
      if (existente) {
        return {
          status: 409,
          jsonBody: { error: `Já existe um ativo com o patrimônio ${body.numeroPatrimonio}.` },
          headers: { "Content-Type": "application/json" },
        };
      }

      const ultimo = await colecao.find().sort({ id: -1 }).limit(1).toArray();
      const proximoId = (ultimo[0]?.id || 0) + 1;

      const novoAtivo = {
        id: proximoId,
        tipo: body.tipo,
        marca: body.marca || "",
        modelo: body.modelo || "",
        numeroPatrimonio: body.numeroPatrimonio,
        numeroSerie: body.numeroSerie || "",
        status,
        colaborador: body.colaborador || null,
        setor: body.setor || null,
        dataAquisicao: body.dataAquisicao || new Date().toISOString().slice(0, 10),
        valorAquisicao: Number(body.valorAquisicao) || 0,
      };

      await colecao.insertOne(novoAtivo);
      delete novoAtivo._id;

      return {
        status: 201,
        jsonBody: novoAtivo,
        headers: { "Content-Type": "application/json" },
      };
    } catch (error) {
      context.error("Erro ao inserir ativo no MongoDB:", error);
      return {
        status: 500,
        jsonBody: { error: error.message },
        headers: { "Content-Type": "application/json" },
      };
    }
  },
});
