import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { MailService } from '../mail/mail.service'
import { RegisterDto } from './dto/register.dto'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { LoginDto } from './dto/login.dto'
import { ResendOtpDto } from './dto/resend-otp.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { VerifyResetOtpDto } from './dto/verify-reset-otp.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import type { AuthUser } from '../types/user'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly mail: MailService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    // Generate a random 4-digit OTP
    private generateOtp(): string {
        return Math.floor(1000 + Math.random() * 9000).toString()
    }

    // Sign a short-lived access token (15 minutes)
    private signAccessToken(userId: string, email: string, role: string): string {
        return this.jwt.sign(
            { sub: userId, email, role },
            {
                secret: this.config.get<string>('JWT_ACCESS_SECRET')!,
                expiresIn: 15 * 60,
            },
        )
    }

    // Sign a long-lived refresh token (7 days)
    private signRefreshToken(userId: string): string {
        return this.jwt.sign(
            { sub: userId },
            {
                secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
                expiresIn: 7 * 24 * 60 * 60,
            },
        )
    }

    // Hash and store refresh token in DB — returns the raw token to set as cookie
    private async createRefreshToken(userId: string): Promise<string> {
        const raw = this.signRefreshToken(userId)
        const hashed = await bcrypt.hash(raw, 10)

        await this.prisma.client.refreshToken.create({
            data: {
                token: hashed,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        })

        return raw
    }

    // Map Prisma user to User type from @theokallia/types
    private mapUser(user: {
        id: string
        firstName: string
        lastName: string
        email: string
        role: string
        emailVerified: boolean
        phone?: string | null
        address?: string | null
    }): AuthUser {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role as 'customer' | 'admin',
            emailVerified: user.emailVerified,
            phone: user.phone ?? undefined,
            address: user.address ?? undefined,
        }
    }

    // Register 
    async register(dto: RegisterDto): Promise<{ message: string }> {
        const existing = await this.prisma.client.user.findUnique({
            where: { email: dto.email },
        })

        if (existing) {
            throw new ConflictException('Email already in use')
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        await this.prisma.client.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    password: hashedPassword,
                    emailVerified: false,
                    role: 'customer',
                },
            })
        })

        const otp = this.generateOtp()
        await this.redis.set(`otp:${dto.email}`, otp, 300)

        void this.mail.sendOtp(dto.email, otp)

        return { message: 'Check your email for your verification code' }
    }

    // Verify OTP
    async verifyOtp(dto: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> {
        const storedOtp = await this.redis.get(`otp:${dto.email}`)

        if (!storedOtp || storedOtp !== dto.otp) {
            throw new UnauthorizedException('Invalid or expired OTP')
        }

        const user = await this.prisma.client.user.findUnique({
            where: { email: dto.email },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        await this.prisma.client.$transaction(async (tx) => {
            await tx.user.update({
                where: { email: dto.email },
                data: { emailVerified: true },
            })
        })

        await this.redis.del(`otp:${dto.email}`)

        const accessToken = this.signAccessToken(user.id, user.email, user.role)
        const refreshToken = await this.createRefreshToken(user.id)

        return { accessToken, refreshToken, user: this.mapUser(user) }
    }

    // Resend OTP
    async resendOtp(dto: ResendOtpDto): Promise<{ message: string }> {
        const user = await this.prisma.client.user.findUnique({
            where: { email: dto.email },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (user.emailVerified) {
            throw new ConflictException('Email is already verified')
        }

        const otp = this.generateOtp()
        await this.redis.set(`otp:${dto.email}`, otp, 300)

        void this.mail.sendOtp(dto.email, otp)

        return { message: 'A new verification code has been sent to your email' }
    }

    // Login 
    async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> {
        const user = await this.prisma.client.user.findUnique({
            where: { email: dto.email },
        })

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        if (!user.emailVerified) {
            throw new ForbiddenException('Please verify your email before logging in')
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password)

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials')
        }

        await this.prisma.client.$transaction(async (tx) => {
            await tx.refreshToken.deleteMany({ where: { userId: user.id } })
        })

        const accessToken = this.signAccessToken(user.id, user.email, user.role)
        const refreshToken = await this.createRefreshToken(user.id)

        return { accessToken, refreshToken, user: this.mapUser(user) }
    }

    // Refresh 
    async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        let payload: { sub: string }

        try {
            payload = this.jwt.verify<{ sub: string }>(rawRefreshToken, {
                secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
            })
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token')
        }

        const storedTokens = await this.prisma.client.refreshToken.findMany({
            where: {
                userId: payload.sub,
                expiresAt: { gt: new Date() },
            },
        })

        let matchedToken: {
            id: string
            token: string
            userId: string
            expiresAt: Date
            createdAt: Date
        } | null = null

        for (const stored of storedTokens) {
            const match = await bcrypt.compare(rawRefreshToken, stored.token)
            if (match) {
                matchedToken = stored
                break
            }
        }

        if (!matchedToken) {
            throw new UnauthorizedException('Invalid or expired refresh token')
        }

        const user = await this.prisma.client.user.findUnique({
            where: { id: payload.sub },
        })

        if (!user) {
            throw new UnauthorizedException()
        }

        await this.prisma.client.$transaction(async (tx) => {
            await tx.refreshToken.delete({ where: { id: matchedToken.id } })
        })

        const accessToken = this.signAccessToken(user.id, user.email, user.role)
        const refreshToken = await this.createRefreshToken(user.id)

        return { accessToken, refreshToken }
    }

    // Logout 
    async logout(rawRefreshToken: string): Promise<{ message: string }> {
        if (!rawRefreshToken) return { message: 'Logged out' }

        try {
            const payload = this.jwt.decode(rawRefreshToken)
            if (!payload || typeof payload !== 'object' || !('sub' in payload)) return { message: 'Logged out' }

            const storedTokens = await this.prisma.client.refreshToken.findMany({
                where: { userId: payload.sub as string, expiresAt: { gt: new Date() } },
            })

            for (const stored of storedTokens) {
                const match = await bcrypt.compare(rawRefreshToken, stored.token)
                if (match) {
                    await this.prisma.client.refreshToken.delete({ where: { id: stored.id } })
                    break
                }
            }
        } catch {
            // Silent fail — logout should never error
        }

        return { message: 'Logged out' }
    }

    // Forgot Password
    async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
        const user = await this.prisma.client.user.findUnique({
            where: { email: dto.email },
        })

        // Don't reveal whether email exists — always return the same message
        if (!user) {
            return { message: 'A reset code has been sent to your mail' }
        }

        const otp = this.generateOtp()
        await this.redis.set(`reset:${dto.email}`, otp, 300)

        void this.mail.sendPasswordResetOtp(dto.email, otp)

        return { message: 'If that email exists, a reset code has been sent' }
    }

    // Verify Reset OTP
    async verifyResetOtp(dto: VerifyResetOtpDto): Promise<{ message: string }> {
        const storedOtp = await this.redis.get(`reset:${dto.email}`)

        if (!storedOtp || storedOtp !== dto.otp) {
            throw new UnauthorizedException('Invalid or expired code')
        }

        await this.redis.del(`reset:${dto.email}`)

        // Grant a 10-minute window to set a new password
        await this.redis.set(`reset-grant:${dto.email}`, '1', 600)

        return { message: 'Code verified. You may now reset your password.' }
    }

    // Reset Password
    async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
        const grant = await this.redis.get(`reset-grant:${dto.email}`)

        if (!grant) {
            throw new UnauthorizedException('Reset session expired. Please start again.')
        }

        const user = await this.prisma.client.user.findUnique({
            where: { email: dto.email },
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const hashed = await bcrypt.hash(dto.password, 10)

        await this.prisma.client.user.update({
            where: { email: dto.email },
            data: { password: hashed },
        })

        await this.redis.del(`reset-grant:${dto.email}`)

        await this.prisma.client.refreshToken.deleteMany({
            where: { userId: user.id },
        })

        return { message: 'Password reset successfully. Please sign in.' }
    }
}