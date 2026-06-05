import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://imocrm-danteprado91.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODA2MzkxMDAsImlkIjoiMDE5ZTk2NWMtNTgwMS03NjU1LTk0ODUtODY3MjYwNjBkYjdlIiwicmlkIjoiZTRlNjYyZTktYTE5NC00N2E4LTkzMDUtYjRjYTIxZjJhZGIzIn0.myPBSno4KMj81Li66Pla53iT9SysyqTw9LMwK8A9u3seQvTdYDzBgV61hkppZATb6D4Cd1SkjIXi8EZAC-eIDw",
});

const r1 = await client.execute('SELECT id, email, name, role, active FROM "User"');
console.log("Users:", JSON.stringify(r1.rows, null, 2));

const r2 = await client.execute('SELECT COUNT(*) as cnt FROM "Property"');
console.log("Properties count:", r2.rows[0].cnt);

const r3 = await client.execute('SELECT id, title, address, type FROM "Property" LIMIT 3');
console.log("Sample properties:", JSON.stringify(r3.rows, null, 2));

const r4 = await client.execute('SELECT COUNT(*) as cnt FROM "SiteConfig"');
console.log("SiteConfig count:", r4.rows[0].cnt);

client.close();
