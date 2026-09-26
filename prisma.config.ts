import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations use Neon's DIRECT (unpooled) connection; the app runtime uses the pooled DATABASE_URL (src/lib/db.ts).
// Falls back gracefully so `prisma generate` works in CI/Vercel builds before env vars are wired.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
