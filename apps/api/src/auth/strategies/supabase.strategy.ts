import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(private config: ConfigService) {
    super({
      // Extract the JWT from the httpOnly cookie set by @supabase/ssr on the frontend
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // Read the Supabase access token from the httpOnly cookie
          return (req?.cookies as Record<string, string>)?.['sb-access-token'] ?? null
        },
      ]),
      // Verify the token using the Supabase JWT secret from your .env
      // The ! assertion is safe here — Joi validation crashes the app on startup if this is missing
      secretOrKey: config.get<string>('SUPABASE_JWT_SECRET')!,
      // Let Supabase handle token expiry — don't ignore it
      ignoreExpiration: false,
    })
  }

  validate(payload: { sub: string; email: string }): { supabaseId: string; email: string } {
    // This return value gets attached to req.user on every protected request
    // supabaseId is the user's ID in Supabase auth.users
    return { supabaseId: payload.sub, email: payload.email }
  }
}