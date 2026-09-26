import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 (Rust-free) over node-postgres. On Vercel point DATABASE_URL at Neon's
 * *pooled* endpoint (host contains `-pooler`) so serverless functions share PgBouncer.
 */
const createClient = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
