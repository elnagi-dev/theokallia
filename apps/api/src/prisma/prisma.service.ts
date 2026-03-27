import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService {
  // Single PrismaClient instance shared across the entire NestJS app
  private readonly prisma: PrismaClient

  constructor() {
    // Prisma 7 requires a database adapter to be passed explicitly
    // PrismaPg connects to PostgreSQL using the DATABASE_URL env var
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    })
    this.prisma = new PrismaClient({ adapter })
  }

  // Expose prisma client methods directly
  // This allows services to call this.prisma.user.findMany() etc.
  get client(): PrismaClient {
    return this.prisma
  }
}