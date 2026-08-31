// Popula a coleção "ativos" no MongoDB Atlas com os dados iniciais do projeto
// (os mesmos 14 ativos que antes viviam só em api/src/data/ativos.json).
//
// Uso:
//   cd api
//   npm install
//   MONGO_URI="mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/?appName=Cluster0" npm run seed
//
// (opcional) MONGO_DB_NAME="ativos_ti" — se omitido, usa "ativos_ti".

const { MongoClient, ServerApiVersion } = require("mongodb");
const ativos = require("../src/data/ativos.json");

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Defina a variável de ambiente MONGO_URI antes de rodar o seed.");
    process.exit(1);
  }

  const client = new MongoClient(mongoUri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME || "ativos_ti");
    const colecao = db.collection("ativos");

    const existentes = await colecao.countDocuments();
    if (existentes > 0) {
      console.log(
        `A coleção "ativos" já tem ${existentes} documento(s). Nada foi inserido (apague a coleção manualmente no Atlas se quiser re-popular do zero).`
      );
      return;
    }

    const resultado = await colecao.insertMany(ativos);
    console.log(`${resultado.insertedCount} ativos inseridos na coleção "ativos".`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Falha ao popular o MongoDB:", err);
  process.exit(1);
});
