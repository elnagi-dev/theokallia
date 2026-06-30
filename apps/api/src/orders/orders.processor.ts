import { Injectable, Logger } from '@nestjs/common'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { PrismaService } from '../prisma/prisma.service'
import { OrdersService } from './orders.service'

@Processor('orders')
export class OrdersProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersProcessor.name)

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {
    super()
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'cleanup-reservation':
        return this.handleReservationExpiry(job.data.orderId)
      default:
        this.logger.warn(`Unknown job name: ${job.name}`)
    }
  }

  private async handleReservationExpiry(orderId: string) {
    this.logger.log(`Checking reservation expiry for order ${orderId}`)

    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
    })

    if (!order) return

    // Only cancel if it's still pending
    if (order.status === 'pending') {
      this.logger.log(`Order ${orderId} expired. Cancelling and releasing stock.`)
      
      await this.prisma.client.$transaction([
        this.prisma.client.order.update({
          where: { id: orderId },
          data: { status: 'cancelled' },
        }),
        this.prisma.client.stockReservation.deleteMany({
          where: { orderId },
        }),
      ])
    }
  }
}
