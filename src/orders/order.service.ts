import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @InjectQueue('orders') private ordersQueue: Queue,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const savedOrder = await this.orderRepository.createAndSave({
      ...createOrderDto,
      status: OrderStatus.PENDING,
    });

    await this.ordersQueue.add({
      orderId: savedOrder.orderId,
    });
    return savedOrder;
  }

  async findOne(orderId: string): Promise<{ status: OrderStatus | null }> {
    const order = await this.orderRepository.getOrderById(orderId);
    return { status: order ? order.status : null };
  }

  async updateStatus(updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.updateStatus(
      updateOrderDto.orderId,
      updateOrderDto.status,
    );
  }
}
