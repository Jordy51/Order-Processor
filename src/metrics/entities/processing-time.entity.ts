import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProcessingTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  precessingTime: number;
}
