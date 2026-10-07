import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civicconnect';
  const isProductionUri = uri.startsWith('mongodb+srv://') || uri.includes('.mongodb.net');

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isProductionUri ? 10000 : 2000,
    });
    const host = isProductionUri ? 'MongoDB Atlas' : mongoose.connection.host;
    console.log(`[MongoDB] ✅ Connected to ${host}`);
  } catch (err) {
    if (isProductionUri) {
      // In production with a real Atlas URI, fail fast — do NOT silently use in-memory
      console.error('[MongoDB] ❌ Failed to connect to MongoDB Atlas:', err.message);
      process.exit(1);
    }

    console.warn(`[MongoDB] Local connection to ${uri} failed (${err.message}).`);
    console.log('[MongoDB] Starting MongoMemoryServer fallback for local development...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[MongoDB] ✅ Connected to In-Memory MongoDB at ${memUri}`);
    } catch (memErr) {
      console.error('[MongoDB] In-Memory MongoDB initialization failed:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
