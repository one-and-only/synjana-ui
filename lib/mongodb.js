import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(" MONGODB_URI is missing in the .env file!");
}

if (!MONGODB_DB) {
  throw new Error(" MONGODB_DB is missing in the .env file!");
}


let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { client: null, promise: null };
}

async function connectToDatabase() {
  if (!cached.client) {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cached.promise = client.connect();
    cached.client = await cached.promise;
  }

  return {
    client: cached.client,
    db: cached.client.db(MONGODB_DB), 
  };
}

export default connectToDatabase;
