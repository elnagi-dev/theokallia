import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { SupabaseStrategy } from './strategies/supabase.strategy'

// No controller here — NestJS handles zero auth endpoints.
// All auth actions (signup, login, OTP, Google OAuth, token refresh)
// happen on the frontend via @supabase/supabase-js directly.
// NestJS only verifies the Supabase JWT on incoming requests.
@Module({
  imports: [
    // Register Passport with 'supabase' as the default strategy
    PassportModule.register({ defaultStrategy: 'supabase' }),
  ],
  providers: [
    // The strategy that verifies the Supabase JWT from the httpOnly cookie
    SupabaseStrategy,
  ],
  exports: [
    // Export PassportModule so other modules can use SupabaseAuthGuard
    PassportModule,
  ],
})
export class AuthModule {}