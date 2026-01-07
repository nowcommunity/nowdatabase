import { PrismaClient } from '@prisma/client';

// Singleton PrismaClient instance for all tests to prevent connection pool exhaustion
export const testPrisma = new PrismaClient();
