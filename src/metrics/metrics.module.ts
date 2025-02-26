import { forwardRef, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { OrderModule } from '../orders/order.module';
import { ProcessingTimeRepository } from './repositories/processing-time.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessingTime } from './entities/processing-time.entity';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessingTime]),
    forwardRef(() => OrderModule),
  ],
  controllers: [MetricsController],
  providers: [MetricsService, ProcessingTimeRepository],
  exports: [MetricsService],
})
export class MetricsModule {}
