import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "./src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function wipe() {
  console.log("Wiping all products from the database...");
  await db.delete(products);
  console.log("Wipe complete! No more placeholder products.");
}

wipe().catch(console.error);
