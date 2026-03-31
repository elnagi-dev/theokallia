import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security headers
  app.use(helmet())

  app.use(cookieParser())

  // CORS — only allow frontend origins
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://theokallia.vercel.app',
      'https://theokallia.com',
      'https://admin.theokallia.com',
    ],
    credentials: true,
  })

  // URI versioning — all routes prefixed with /v{n}/
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  // Global validation — strips unknown fields, auto-transforms DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Theokallia API')
    .setDescription('Theokallia jewellery API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT ?? 3333)
}

void bootstrap()