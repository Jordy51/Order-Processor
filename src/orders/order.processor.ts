import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';
import { ProcessingTimeRepository } from './repositories/processingtime.repository';

@Processor('orders')
export class OrderProcessor {
  private minDelay = 500;
  private maxDelay = 3000;
  constructor(
    private readonly ordersService: OrderService,
    private readonly processingTimeRepository: ProcessingTimeRepository,
  ) {}

  @Process({ concurrency: 20 })
  async handleOrderProcessing(job: Job<{ orderId: string }>) {
    const processingDelay =
      Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) +
      this.minDelay;

    const orderId = job.data.orderId;
    await this.ordersService.updateStatus({
      orderId: orderId,
      status: OrderStatus.PROCESSING,
    });

    // Simulate order processing delay
    await new Promise((resolve) => setTimeout(resolve, processingDelay));

    await this.processingTimeRepository.createAndSave({
      orderId: orderId,
      precessingTime: processingDelay,
    });
    await this.ordersService.updateStatus({
      orderId: orderId,
      status: OrderStatus.COMPLETED,
    });
  }
}
