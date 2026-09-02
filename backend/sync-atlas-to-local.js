import { MongoClient } from "mongodb";

const ATLAS_URI = process.env.MONGODB_ATLAS_URI || "";
const LOCAL_URI = "mongodb://root:secretpassword@127.0.0.1:27017/?authSource=admin";

async function sync() {
  console.log("Connecting to Atlas...");
  const atlasClient = new MongoClient(ATLAS_URI);
  await atlasClient.connect();
  console.log("Connected to Atlas.");

  console.log("Connecting to Local MongoDB...");
  const localClient = new MongoClient(LOCAL_URI);
  await localClient.connect();
  console.log("Connected to Local MongoDB.");

  // List databases on Atlas
  const adminDb = atlasClient.db().admin();
  const dbsList = await adminDb.listDatabases();
  console.log("Atlas Databases:", dbsList.databases.map(d => d.name));

  for (const dbInfo of dbsList.databases) {
    if (["admin", "local", "config"].includes(dbInfo.name)) continue;

    const dbName = dbInfo.name;
    console.log(`\n--- Syncing database: ${dbName} ---`);
    const atlasDb = atlasClient.db(dbName);
    const localDb = localClient.db(dbName);

    const collections = await atlasDb.listCollections().toArray();
    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith("system.")) continue;

      const atlasCol = atlasDb.collection(colName);
      const localCol = localDb.collection(colName);

      const docs = await atlasCol.find({}).toArray();
      console.log(`Collection '${colName}': Found ${docs.length} documents on Atlas.`);

      if (docs.length > 0) {
        // Drop existing collection in local to avoid duplicate key conflicts
        await localCol.deleteMany({});
        await localCol.insertMany(docs);
        console.log(`  -> Successfully copied ${docs.length} documents to local '${colName}'.`);
      } else {
        console.log(`  -> Skipped (empty collection).`);
      }
    }
  }

  await atlasClient.close();
  await localClient.close();
  console.log("\nAll data successfully migrated from Atlas to Local MongoDB!");
}

sync().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
