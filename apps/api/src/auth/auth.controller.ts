import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { LoginDto } from './dto/login.dto'
import { ResendOtpDto } from './dto/resend-otp.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // POST /auth/register
  // Creates user, sends OTP email, returns success message
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  // POST /auth/verify-otp
  // Verifies OTP, marks email as verified, sets auth cookies
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto)

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return { message: 'Email verified successfully', user: result.user }
  }

  // POST /auth/resend-otp
  // Resends OTP to user
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto)
  }

  // POST /auth/login
  // Verifies credentials, sets auth cookies
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto)

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return { message: 'Logged in successfully', user: result.user }
  }

  // POST /auth/refresh
  // Reads refresh token from cookie, rotates tokens, sets new cookies
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = (req.cookies as Record<string, string>)['refresh_token']

    const { accessToken, refreshToken } = await this.authService.refresh(rawRefreshToken)

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return { message: 'Tokens refreshed successfully' }
  }

  // POST /auth/logout
  // Deletes refresh token from DB, clears auth cookies
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = (req.cookies as Record<string, string>)['refresh_token']

    await this.authService.logout(rawRefreshToken)

    res.clearCookie('access_token')
    res.clearCookie('refresh_token')

    return { message: 'Logged out successfully' }
  }
}