import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { OrdersProcessor } from './orders.processor'
import { CouponsModule } from '../coupons/coupons.module'

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'orders',
    }),
    CouponsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProcessor],
  exports: [OrdersService],
})
export class OrdersModule {}
