import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProcessingTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  precessingTime: number;

  //   @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  //   createdAt: Date;

  //   @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  //   updatedAt: Date;
}
