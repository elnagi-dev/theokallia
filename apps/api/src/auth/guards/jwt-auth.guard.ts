import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// Protects routes by verifying the JWT access token from the httpOnly cookie
// Populates req.user with { userId, email, role } on successful verification
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}