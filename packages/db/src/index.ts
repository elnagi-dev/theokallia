import { PrismaClient } from './generated'

// Prevent multiple PrismaClient instances in development due to hot reloading
// In production a single instance is always created
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Re-export PrismaClient explicitly to ensure proper type resolution
export { PrismaClient }
export * from '@prisma/client'