import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken: token });

const sql = readFileSync("prisma/all_migrations.sql", "utf8");

// Split by semicolons but keep CREATE TRIGGER statements intact
const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const stmt of statements) {
  try {
    await client.execute(stmt + (stmt.endsWith(";") ? "" : ";"));
    console.log("OK:", stmt.slice(0, 60) + "...");
  } catch (err) {
    // Table already exists is OK
    if (err.message?.includes("already exists")) {
      console.log("SKIP (exists):", stmt.slice(0, 60) + "...");
    } else {
      console.error("ERROR:", err.message);
      console.error("SQL:", stmt);
    }
  }
}

console.log("Done!");
client.close();
