import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { db } from "../../lib/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("🚀 Running migrations…");
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  console.log("✅ Migration complete!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Migration failed:");
  console.error(err);
  process.exit(1);
});
