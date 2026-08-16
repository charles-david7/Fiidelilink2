import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MerchantPlan { STARTER = 'starter', PRO = 'pro', BUSINESS = 'business' }
export enum MerchantStatus { PENDING = 'pending', ACTIVE = 'active', SUSPENDED = 'suspended' }

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) logo: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) address: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) phone: string;
  @Column({ type: 'enum', enum: MerchantPlan, default: MerchantPlan.STARTER }) plan: MerchantPlan;
  @Column({ type: 'enum', enum: MerchantStatus, default: MerchantStatus.PENDING }) status: MerchantStatus;
  @Column({ default: 0 }) followerCount: number;
  @Column({ default: 0 }) totalScans: number;
  @Column() userId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}