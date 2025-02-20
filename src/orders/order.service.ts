import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findByOrderIdOrThrow(orderId: string) {
    const order = await this.orderRepository.getOrderById(orderId);
    if (order == null) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderRepository.getOrderById(
      createOrderDto.orderId,
    );
    if (order != null) {
      throw new HttpException('Order already exists', HttpStatus.BAD_REQUEST);
    }
    const savedOrder = await this.orderRepository.createAndSave({
      ...createOrderDto,
      status: OrderStatus.PENDING,
    });

    this.ordersQueue
      .add({
        orderId: savedOrder.orderId,
      })
      .catch((e) => console.log(e));
    return savedOrder;
  }

  async getStatus(orderId: string): Promise<{ status: OrderStatus }> {
    const order = await this.findByOrderIdOrThrow(orderId);
    return { status: order.status };
  }

  async updateStatus(updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.updateStatus(
      updateOrderDto.orderId,
      updateOrderDto.status,
    );
  }

  async getOrderStats() {
    const [pendingCount, processingCount, completedCount] = await Promise.all([
      this.orderRepository.countOrdersByStatus(OrderStatus.PENDING),
      this.orderRepository.countOrdersByStatus(OrderStatus.PROCESSING),
      this.orderRepository.countOrdersByStatus(OrderStatus.COMPLETED),
    ]);
    return { pendingCount, processingCount, completedCount };
  }
}
