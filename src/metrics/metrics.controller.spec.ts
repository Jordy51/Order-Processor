import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: Partial<MetricsService>;

  beforeEach(async () => {
    metricsService = {
      metricData: jest
        .fn()
        .mockReturnValue({ ordersProcessed: 10, processingTime: '200ms' }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [{ provide: MetricsService, useValue: metricsService }],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processingCount', () => {
    it('should return metric data', () => {
      const result = controller.processingCount();
      expect(result).toEqual({ ordersProcessed: 10, processingTime: '200ms' });
      expect(metricsService.metricData).toHaveBeenCalled();
    });
  });
});
