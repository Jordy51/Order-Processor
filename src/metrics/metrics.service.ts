import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ProcessingTimeRepository } from './repositories/processing-time.repository';
import { OrderService } from 'src/orders/order.service';

@Injectable()
export class MetricsService {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly processingTimeRepository: ProcessingTimeRepository,
  ) {}

  async metricData() {
    const { pendingCount, processingCount, completedCount } =
      await this.orderService.getOrderStats();

    const noRequest = await this.processingTimeRepository.countRequests();

    const totalTime =
      await this.processingTimeRepository.sumField('precessingTime');

    const avgProcessingTime = Number((totalTime / noRequest / 1000).toFixed(3));

    const data = {
      totalCount: pendingCount + processingCount + completedCount,
      pendingCount,
      processingCount,
      completedCount,
      avgProcessingTime,
    };

    return data;
  }

  async create(orderId: string, processingTime: number) {
    await this.processingTimeRepository.createAndSave({
      orderId: orderId,
      precessingTime: processingTime,
    });
  }
}
