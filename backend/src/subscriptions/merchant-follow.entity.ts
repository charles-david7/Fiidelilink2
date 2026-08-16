import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('merchant_follows')
@Unique(['userId', 'merchantId'])
export class MerchantFollow {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() merchantId: string;
  @Column({ default: true }) notifEnabled: boolean;
  @CreateDateColumn() followedAt: Date;
}