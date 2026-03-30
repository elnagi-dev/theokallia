import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  // Find a user by their database ID
  // Called after JWT verification to get the full user record
  async findById(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Never return the password hash to the client
    const { password: _password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Find a user by email — used internally by AuthService during login
  async findByEmail(email: string) {
    return this.prisma.client.user.findUnique({
      where: { email },
    })
  }

  // Update the current user's profile
  // Only fields provided in the DTO will be updated
  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.client.user.update({
      where: { id: userId },
      data: dto,
    })

    // Never return the password hash to the client
    const { password: _password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}