import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { OrderRepository } from './order.repository';
import { Order, OrderStatus } from '../entities/order.entity';

const mockOrder: Order = {
  orderId: '123',
  status: OrderStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Order;

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn().mockReturnValue({
              save: jest.fn().mockResolvedValue(mockOrder),
              findOne: jest.fn().mockResolvedValue(mockOrder),
              count: jest.fn().mockResolvedValue(5),
            }),
          },
        },
      ],
    }).compile();

    orderRepository = module.get<OrderRepository>(OrderRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should create and save an order', async () => {
    const result = await orderRepository.createAndSave(mockOrder);
    expect(result).toEqual(mockOrder);
  });

  it('should retrieve an order by ID', async () => {
    const result = await orderRepository.getOrderById('123');
    expect(result).toEqual(mockOrder);
  });

  it('should update order status', async () => {
    const updatedOrder = { ...mockOrder, status: OrderStatus.COMPLETED };
    jest.spyOn(orderRepository, 'save').mockResolvedValue(updatedOrder);

    const result = await orderRepository.updateStatus(
      '123',
      OrderStatus.COMPLETED,
    );
    expect(result.status).toBe(OrderStatus.COMPLETED);
  });

  it('should count orders by status', async () => {
    const result = await orderRepository.countOrdersByStatus(
      OrderStatus.PENDING,
    );
    expect(result).toBe(5);
  });
});
