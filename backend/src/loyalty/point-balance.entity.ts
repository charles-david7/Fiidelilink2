import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../merchants/merchant.entity';

@Entity('point_balances')
@Unique(['userId', 'merchantId'])
export class PointBalance {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() merchantId: string;
  @Column({ default: 0 }) balance: number;
  @ManyToOne(() => Merchant) @JoinColumn({ name: 'merchantId' }) merchant: Merchant;
  @UpdateDateColumn() updatedAt: Date;
}