const { app } = require("@azure/functions");
const usuarios = require("../data/usuarios.json");

// GET /api/usuarios
// Retorna os usuários do sistema e seus perfis de acesso (RF06/RF07).
app.http("usuarios", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "usuarios",
  handler: async (request, context) => {
    context.log("GET /api/usuarios");

    return {
      status: 200,
      jsonBody: usuarios,
      headers: { "Content-Type": "application/json" },
    };
  },
});
