import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path for the persistent local database storage
const dbPath = path.resolve(__dirname, '..', '.local-mongo-db');

// Ensure the directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

async function startLocalDb() {
  console.log(`Starting local MongoDB at ${dbPath}...`);
  console.log('This may take a moment to download the MongoDB binary on the first run.');
  
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbPath: dbPath,
        storageEngine: 'wiredTiger' // Required for persistence
      }
    });

    const uri = mongod.getUri();
    console.log('\n=========================================');
    console.log(`✅ Local MongoDB running at: ${uri}`);
    console.log('=========================================\n');
    console.log('Press Ctrl+C to stop the database.');
    
    // Keep the process alive
    process.on('SIGINT', async () => {
      console.log('\nStopping local MongoDB...');
      await mongod.stop();
      process.exit();
    });
  } catch (err) {
    console.error('Failed to start local MongoDB:', err);
    process.exit(1);
  }
}

startLocalDb();
