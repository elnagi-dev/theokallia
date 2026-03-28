import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'

// Shape of the JWT payload — what we store inside the access token
export interface JwtPayload {
  sub: string    // user ID
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      // Extract the access token from the httpOnly cookie set on login
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (req?.cookies as Record<string, string>)?.['access_token'] ?? null
        },
      ]),
      // Verify the token using the access secret from .env
      // ! is safe — Joi validation crashes the app on startup if this is missing
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET')!,
      ignoreExpiration: false,
    })
  }

  validate(payload: JwtPayload): { userId: string; email: string; role: string } {
    if (!payload.sub) {
      throw new UnauthorizedException()
    }

    // This return value gets attached to req.user on every protected request
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }
  }
}