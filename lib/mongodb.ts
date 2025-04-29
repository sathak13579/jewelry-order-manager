import mongoose, { Connection } from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/jewelry-orders";

// This is the admin database that stores users, clients, etc.
const MONGODB_URI_BASE =
  process.env.MONGODB_URI_BASE || "mongodb://localhost:27017/";

if (!MONGODB_URI || !MONGODB_URI_BASE) {
  throw new Error("Please define the MONGODB_URI environment variables");
}

/**
 * Global is used here to maintain cached connections across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const globalAny: any = global as any;

// Initialize connection cache
if (!globalAny.mongoose) {
  globalAny.mongoose = { conn: null, promise: null };
}

// Initialize client connections cache
if (!globalAny.mongooseClients) {
  globalAny.mongooseClients = {};
}

// Connect to the admin database
async function dbConnect() {
  if (globalAny.mongoose.conn) {
    return globalAny.mongoose.conn;
  }

  if (!globalAny.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    globalAny.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  globalAny.mongoose.conn = await globalAny.mongoose.promise;
  return globalAny.mongoose.conn;
}

// Connect to a client-specific database
async function connectToClientDb(dbName: string): Promise<Connection> {
  if (globalAny.mongooseClients[dbName]?.conn) {
    return globalAny.mongooseClients[dbName].conn;
  }

  if (!globalAny.mongooseClients[dbName]) {
    globalAny.mongooseClients[dbName] = { conn: null, promise: null };
  }

  if (!globalAny.mongooseClients[dbName].promise) {
    const opts = {
      bufferCommands: false,
    };

    const clientUri = `${MONGODB_URI_BASE}${dbName}`;
    try {
      const connection = await mongoose.createConnection(clientUri, opts);
      globalAny.mongooseClients[dbName].conn = connection;
      globalAny.mongooseClients[dbName].promise = Promise.resolve(connection);
      return connection;
    } catch (error) {
      console.error(`Error connecting to client database ${dbName}:`, error);
      throw error;
    }
  } else {
    globalAny.mongooseClients[dbName].conn = await globalAny.mongooseClients[
      dbName
    ].promise;
    return globalAny.mongooseClients[dbName].conn;
  }
}

export { connectToClientDb };
export default dbConnect;
