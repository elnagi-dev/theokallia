import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

// Represents the authenticated user attached to every request by SupabaseAuthGuard
interface AuthenticatedRequest extends Request {
  user: {
    supabaseId: string
    email: string
  }
}

// All routes in this controller require a valid Supabase JWT cookie
// SupabaseAuthGuard verifies the token and populates req.user with { supabaseId, email }
@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users/sync
  // Called by the frontend after OTP verification to create the user in public.User
  // Safe to call multiple times — upsert ensures no duplicate records
  @Post('sync')
  async sync(@Req() req: AuthenticatedRequest) {
    return this.usersService.syncUser(req.user.supabaseId, req.user.email)
  }

  // GET /users/me
  // Returns the current logged-in user's profile
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.findBySupabaseId(req.user.supabaseId)
  }

  // PATCH /users/me
  // Updates the current logged-in user's profile
  @Patch('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.supabaseId, dto)
  }
}