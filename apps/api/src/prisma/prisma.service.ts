import { Injectable } from '@nestjs/common'
import { PrismaClient, prisma } from '@theokallia/db'

@Injectable()
export class PrismaService {
  // Explicitly typed to avoid portable type reference error
  // Prisma 7 manages connections automatically — no manual $connect() needed
  client: PrismaClient = prisma
}