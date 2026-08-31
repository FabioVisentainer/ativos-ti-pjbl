const { MongoClient, ServerApiVersion } = require("mongodb");

// Reaproveita a conexão entre invocações da mesma instância da Function
// (padrão recomendado p/ Azure Functions: evita reconectar a cada request).
let clientPromise = null;

function getClient() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error(
      "A variável de ambiente MONGO_URI não foi configurada (ver api/local.settings.json.example)."
    );
  }

  if (!clientPromise) {
    const client = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    clientPromise = client.connect();
  }

  return clientPromise;
}

// Coleção "ativos" no banco configurado por MONGO_DB_NAME (padrão: ativos_ti).
async function getAtivosCollection() {
  const client = await getClient();
  const db = client.db(process.env.MONGO_DB_NAME || "ativos_ti");
  return db.collection("ativos");
}

module.exports = { getClient, getAtivosCollection };
