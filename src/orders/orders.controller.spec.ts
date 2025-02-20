import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './orders.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

describe('OrdersController', () => {
  let controller: OrderController;
  let orderService: Partial<OrderService>;

  beforeEach(async () => {
    orderService = {
      create: jest.fn().mockImplementation((dto: CreateOrderDto) => ({
        id: '1',
        ...dto,
        status: OrderStatus.PENDING,
        createdAt: '2025-02-20T09:43:37.000Z',
        updatedAt: '2025-02-20T09:43:37.000Z',
      })),
      getStatus: jest.fn().mockImplementation((orderId: string) => ({
        orderId,
        status: OrderStatus.PROCESSING,
      })),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const orderData: CreateOrderDto = {
        userId: 'USR111',
        orderId: 'ORD222',
        itemIds: ['ITM333'],
        totalAmount: 444,
      };
      const result = await controller.create(orderData);
      expect(result).toEqual({
        id: '1',
        userId: 'USR111',
        orderId: 'ORD222',
        itemIds: ['ITM333'],
        totalAmount: 444,
        status: OrderStatus.PENDING,
        createdAt: '2025-02-20T09:43:37.000Z',
        updatedAt: '2025-02-20T09:43:37.000Z',
      });
      expect(orderService.create).toHaveBeenCalledWith(orderData);
    });
  });

  describe('getStatus', () => {
    it('should return order status', async () => {
      const orderId = '12345';
      const result = await controller.findOne(orderId);
      expect(result).toEqual({
        orderId,
        status: OrderStatus.PROCESSING,
      });
      expect(orderService.getStatus).toHaveBeenCalledWith(orderId);
    });
  });
});
