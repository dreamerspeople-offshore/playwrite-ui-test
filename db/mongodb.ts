import { MongoClient, Db } from "mongodb";
import "dotenv/config";

let client: MongoClient;
let db: Db;

export async function connectMongo(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();

  db = client.db(process.env.MONGO_DB);
  return db;
}

export async function closeMongo() {
  if (client) await client.close();
}

// db/mongodb.ts
export async function getAllProducts() {
  const db = await connectMongo();

  return db.collection("products").find().toArray();
}

export async function getProducts(filter: { active?: string }) {
  const db = await connectMongo();

  return db.collection("products").find(filter).toArray();
}
