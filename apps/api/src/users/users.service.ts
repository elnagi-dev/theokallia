import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Find a user by their Supabase ID
  // Called after JWT verification to get the full user record from public.User
  async findBySupabaseId(supabaseId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { supabaseId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  // Create a user record in public.User on first login
  // Called from POST /users/sync after Supabase OTP verification
  async syncUser(supabaseId: string, email: string) {
    return this.prisma.client.user.upsert({
      where: { supabaseId },
      // If user already exists, do nothing
      update: {},
      // If user doesn't exist, create them with default customer role
      create: {
        supabaseId,
        email,
        name: '',
        role: 'customer',
      },
    })
  }

  // Update the current user's profile
  // Only fields provided in the DTO will be updated
  async updateMe(supabaseId: string, dto: UpdateUserDto) {
    return this.prisma.client.user.update({
      where: { supabaseId },
      data: dto,
    })
  }
}