import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Session } from '@thallesp/nestjs-better-auth'
import { Order } from '@prisma/client'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Creates a new order from the user's current cart.
   */
  @Post()
  async create(@Session() session: any, @Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(session.user.id, dto)
  }

  /**
   * Retrieves the order history for the authenticated user.
   */
  @Get()
  async findAll(@Session() session: any) {
    return this.ordersService.getUserOrders(session.user.id)
  }

  /**
  * Retrieves a specific order by ID for the authenticated user.
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: any) {
    return this.ordersService.getOrderById(session.user.id, id)
  }
}
