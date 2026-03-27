import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().required(),
        FRONTEND_URL: Joi.string().required(),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_ANON_KEY: Joi.string().required(),
        SUPABASE_JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    PrismaModule
  ],
})
export class AppModule { }
