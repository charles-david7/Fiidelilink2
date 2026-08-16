import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointBalance } from './point-balance.entity';

const CONVERSION_RATE = 0.7; // 10 PE → 7 PU

@Injectable()
export class LoyaltyService {
  constructor(@InjectRepository(PointBalance) private repo: Repository<PointBalance>) {}

  async addMerchantPoints(userId: string, merchantId: string, points: number) {
    let pb = await this.repo.findOne({ where: { userId, merchantId } });
    if (!pb) {
      pb = this.repo.create({ userId, merchantId, balance: 0 });
    }
    pb.balance += points;
    return this.repo.save(pb);
  }

  async getBalancesByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      relations: ['merchant'],
      order: { balance: 'DESC' },
    });
  }

  async getBalanceForMerchant(userId: string, merchantId: string) {
    const pb = await this.repo.findOne({ where: { userId, merchantId }, relations: ['merchant'] });
    return pb || { balance: 0, merchantId };
  }

  async convert(userId: string, merchantId: string, peAmount: number): Promise<{ success: boolean; puGained: number; newBalance: number }> {
    const pb = await this.repo.findOne({ where: { userId, merchantId } });
    if (!pb || pb.balance < peAmount) {
      return { success: false, puGained: 0, newBalance: pb?.balance || 0 };
    }
    const puGained = Math.floor(peAmount * CONVERSION_RATE);
    pb.balance -= peAmount;
    await this.repo.save(pb);
    return { success: true, puGained, newBalance: pb.balance };
  }
}