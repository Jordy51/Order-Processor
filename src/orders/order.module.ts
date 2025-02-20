import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './order.processor';
import { OrderRepository } from './repositories/order.repository';
import { ProcessingTime } from './entities/processing-time.entity';
import { ProcessingTimeRepository } from './repositories/processingtime.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, ProcessingTime]),
    BullModule.registerQueue({
      name: 'orders',
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderProcessor,
    OrderRepository,
    ProcessingTimeRepository,
  ],
})
export class OrderModule {}
