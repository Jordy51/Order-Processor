import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from './order.processor';
import { OrderRepository } from './repositories/order.repository';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueue({
      name: 'orders',
    }),
    forwardRef(() => MetricsModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProcessor, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
