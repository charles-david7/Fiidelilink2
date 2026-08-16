import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../merchants/merchant.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() merchantId: string;
  @Column('decimal', { precision: 10, scale: 2 }) amount: number;
  @Column({ default: 0 }) totalPoints: number;
  @Column({ default: 0 }) merchantPoints: number;
  @Column({ default: 0 }) universalPoints: number;
  @ManyToOne(() => Merchant) @JoinColumn({ name: 'merchantId' }) merchant: Merchant;
  @CreateDateColumn() createdAt: Date;
}