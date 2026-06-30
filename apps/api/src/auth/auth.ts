import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { Queue } from 'bullmq'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
})

// Mail queue — mirrors the BullMQ queue in MailModule
const mailQueue = new Queue('mail', {
  connection: { 
    url: process.env.REDIS_URL,
    tls: {},
  },
})

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      try {
        await mailQueue.add('send-reset-password', { email: user.email, url })
        console.log(`[Auth] Successfully queued reset password email for ${user.email}`)
      } catch (err) {
        console.error(`[Auth] Failed to queue reset password email for ${user.email}:`, err)
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await mailQueue.add('send-verification-email', { email: user.email, url })
        console.log(`[Auth] Successfully queued verification email for ${user.email}`)
      } catch (err) {
        console.error(`[Auth] Failed to queue verification email for ${user.email}:`, err)
      }
    },
  },

  user: {
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
        input: true,
      },
      lastName: {
        type: 'string',
        required: true,
        input: true,
      },
      phone: {
        type: 'string',
        required: false,
        input: true,
      },
      address: {
        type: 'string',
        required: false,
        input: true,
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: 'customer',
        input: false, // never set by client
      },
    },
  },
})

export type Auth = typeof auth
