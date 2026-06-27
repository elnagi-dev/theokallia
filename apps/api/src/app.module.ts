import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BullModule } from '@nestjs/bullmq'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module'
import { ProductsModule } from './products/products.module'
import { ReviewsModule } from './reviews/reviews.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { MailModule } from './mail/mail.module'
import { CartModule } from './cart/cart.module'
import { WishlistModule } from './wishlist/wishlist.module'
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth'
import { auth } from './auth/auth'
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().required(),
        FRONTEND_URL: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        BETTER_AUTH_SECRET: Joi.string().required(),
        BETTER_AUTH_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
      }),
    }),
    // Register BullMQ globally — all queues use this Redis connection
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
        tls: {},
      },
    }),
    BetterAuthModule.forRoot({ auth }),
    PrismaModule,
    RedisModule,
    MailModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    CartModule,
    WishlistModule,
  ],
})
export class AppModule {}
