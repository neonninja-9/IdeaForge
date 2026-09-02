import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const LOCAL_URI = 'mongodb://127.0.0.1:27017/ideaforge';
const REMOTE_URI = process.env.MONGODB_URI;

async function migrate() {
  if (!REMOTE_URI) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  if (REMOTE_URI === LOCAL_URI || REMOTE_URI.includes('127.0.0.1') || REMOTE_URI.includes('localhost')) {
    console.error("Current MONGODB_URI in .env points to local. Please restore the remote URI before migrating.");
    process.exit(1);
  }

  console.log(`Connecting to remote database...`);
  const remoteConnection = await mongoose.createConnection(REMOTE_URI).asPromise();
  console.log(`Connected to remote database.`);

  console.log(`Connecting to local database...`);
  const localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log(`Connected to local database.`);

  const remoteDb = remoteConnection.db;
  const localDb = localConnection.db;

  const collections = await remoteDb.listCollections().toArray();
  
  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name;
    // Skip system collections
    if (collectionName.startsWith('system.')) continue;
    
    console.log(`\nMigrating collection: ${collectionName}...`);
    
    const remoteCollection = remoteDb.collection(collectionName);
    const localCollection = localDb.collection(collectionName);
    
    const docs = await remoteCollection.find({}).toArray();
    
    if (docs.length > 0) {
      // Clear the local collection first just in case
      await localCollection.deleteMany({});
      
      const result = await localCollection.insertMany(docs);
      console.log(`✅ Migrated ${result.insertedCount} documents to ${collectionName}.`);
    } else {
      console.log(`⚠️ Collection ${collectionName} is empty. Skipped.`);
    }
  }

  console.log('\n🎉 Migration complete!');
  await remoteConnection.close();
  await localConnection.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
