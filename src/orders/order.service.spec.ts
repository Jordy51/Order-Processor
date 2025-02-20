import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { Queue } from 'bull';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Partial<OrderRepository>;
  let ordersQueue: Partial<Queue>;

  beforeEach(async () => {
    orderRepository = {
      createAndSave: jest.fn().mockImplementation((orderData) =>
        Promise.resolve({
          id: 1,
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
      getOrderById: jest.fn().mockImplementation((orderId: string) =>
        Promise.resolve(
          orderId === 'valid-order'
            ? {
                orderId,
                status: OrderStatus.PENDING,
              }
            : null,
        ),
      ),
      updateStatus: jest
        .fn()
        .mockImplementation((orderId: string, newStatus: OrderStatus) =>
          Promise.resolve({
            orderId,
            status: newStatus,
          }),
        ),
    };
    ordersQueue = {
      count: jest.fn().mockResolvedValue(3),
      getJobCounts: jest.fn().mockResolvedValue({
        waiting: 2,
        active: 1,
        completed: 5,
        failed: 0,
      }),
      add: jest.fn().mockResolvedValue(null),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: orderRepository },
        { provide: 'BullQueue_orders', useValue: ordersQueue }, // Nest injects Bull queue with the token "BullQueue_<queueName>"
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const orderData = {
      userId: '1',
      orderId: '123',
      itemIds: ['1', '2', '3'],
      totalAmount: 100,
    };

    const result = await service.create(orderData);
    expect(result).toHaveProperty('id');
    expect(result.status).toBe(OrderStatus.PENDING);
    expect(orderRepository.createAndSave).toHaveBeenCalledWith({
      ...orderData,
      status: OrderStatus.PENDING,
    });
  });

  it('should update order status', async () => {
    const result = await service.updateStatus({
      orderId: '123',
      status: OrderStatus.COMPLETED,
    });
    expect(result.status).toBe(OrderStatus.COMPLETED);
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(
      '123',
      OrderStatus.COMPLETED,
    );
  });
});
