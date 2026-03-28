import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

// Shape of req.user populated by JwtAuthGuard after token verification
interface AuthenticatedRequest extends Request {
  user: {
    userId: string
    email: string
    role: string
  }
}

// All routes require a valid JWT access token cookie
// JwtAuthGuard verifies the token and populates req.user with { userId, email, role }
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me
  // Returns the current logged-in user's profile
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.userId)
  }

  // PATCH /users/me
  // Updates the current logged-in user's profile
  @Patch('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.userId, dto)
  }
}