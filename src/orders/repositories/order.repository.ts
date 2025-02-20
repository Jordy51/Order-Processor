import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async createAndSave(orderData: Partial<Order>): Promise<Order> {
    const order = this.create(orderData);
    return this.save(order);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.findOne({ where: { orderId } });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.findOne({ where: { orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return this.save(order);
  }

  async countOrdersByStatus(status: OrderStatus): Promise<number> {
    return this.count({ where: { status } });
  }
}
