import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  orderId: string;
  status: OrderStatus;
}
