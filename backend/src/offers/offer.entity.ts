import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../merchants/merchant.entity';

export enum OfferType { PERCENT = 'percent', FIXED = 'fixed', MULTIPLIER = 'multiplier' }

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() merchantId: string;
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'enum', enum: OfferType, default: OfferType.PERCENT }) type: OfferType;
  @Column('decimal', { precision: 5, scale: 2, default: 0 }) value: number;
  @Column({ nullable: true }) targetLevel: string;
  @Column({ nullable: true, type: 'timestamp' }) startDate: Date;
  @Column({ nullable: true, type: 'timestamp' }) endDate: Date;
  @Column({ default: 0 }) quota: number;
  @Column({ default: 0 }) usedCount: number;
  @Column({ default: true }) isActive: boolean;
  @Column({ default: false }) isSponsored: boolean;
  @ManyToOne(() => Merchant) @JoinColumn({ name: 'merchantId' }) merchant: Merchant;
  @CreateDateColumn() createdAt: Date;
}