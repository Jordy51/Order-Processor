import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get(':orderId/status')
  findOne(@Param('orderId') orderId: string) {
    return this.orderService.getStatus(orderId);
  }

  @Get('/metrics')
  processingCount() {
    return this.orderService.processingCount();
  }
}
