import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Merchant } from '../merchants/merchant.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() merchantId: string;
  @Column() title: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'timestamp' }) eventDate: Date;
  @Column({ nullable: true }) location: string;
  @Column({ default: 0 }) totalSlots: number;
  @Column({ default: 0 }) registeredCount: number;
  @Column('decimal', { precision: 8, scale: 2, default: 0 }) normalPrice: number;
  @Column('decimal', { precision: 8, scale: 2, default: 0 }) memberPrice: number;
  @Column({ default: false }) isFree: boolean;
  @Column({ default: true }) isActive: boolean;
  @ManyToOne(() => Merchant) @JoinColumn({ name: 'merchantId' }) merchant: Merchant;
  @CreateDateColumn() createdAt: Date;
}