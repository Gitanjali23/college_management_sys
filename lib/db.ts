import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDB() {
  // If already connected, return
  if (connection.isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI || '');

    connection.isConnected = db.connections[0].readyState;

    console.log("✅ MongoDB Atlas Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    // process.exit is not supported in edge runtime
  }
}

export default connectDB;
