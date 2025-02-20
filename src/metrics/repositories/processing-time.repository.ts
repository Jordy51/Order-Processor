import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProcessingTime } from '../entities/processing-time.entity';

@Injectable()
export class ProcessingTimeRepository extends Repository<ProcessingTime> {
  constructor(private dataSource: DataSource) {
    super(ProcessingTime, dataSource.createEntityManager());
  }

  async countRequests(): Promise<number> {
    return this.count({ where: {} });
  }

  async sumField(field: string): Promise<number> {
    const sum = await this.createQueryBuilder('pt')
      .select(`SUM(pt.${field})`, 'sum')
      .getRawOne<{ sum: string }>();
    if (sum) {
      return Number(sum.sum) || 0;
    } else return 0;
  }

  async createAndSave(
    precessingTimeData: Partial<ProcessingTime>,
  ): Promise<ProcessingTime> {
    const precessingTime = this.create(precessingTimeData);
    return this.save(precessingTime);
  }
}
