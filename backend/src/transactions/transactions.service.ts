import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { UsersService } from '../users/users.service';
import { MerchantsService } from '../merchants/merchants.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private repo: Repository<Transaction>,
    private loyaltyService: LoyaltyService,
    private usersService: UsersService,
    private merchantsService: MerchantsService,
  ) {}

  async scan(userId: string, merchantId: string, amount: number) {
    const merchant = await this.merchantsService.findById(merchantId);
    if (merchant.status !== 'active') throw new ForbiddenException('Cette enseigne nest pas active');

    const totalPoints = Math.floor(amount);
    const merchantPoints = Math.floor(totalPoints * 0.8);
    const universalPoints = Math.floor(totalPoints * 0.2);

    const tx = this.repo.create({ userId, merchantId, amount, totalPoints, merchantPoints, universalPoints });
    await this.repo.save(tx);

    // Créditer les points
    await this.loyaltyService.addMerchantPoints(userId, merchantId, merchantPoints);
    await this.usersService.updateUniversalPoints(userId, universalPoints);
    await this.merchantsService.incrementScan(merchantId);

    return {
      ...tx,
      merchant: { id: merchant.id, name: merchant.name },
      message: `+${merchantPoints} PE chez ${merchant.name} | +${universalPoints} PU`,
    };
  }

  async getMyTransactions(userId: string) {
    return this.repo.find({
      where: { userId },
      relations: ['merchant'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getMerchantTransactions(userId: string) {
    const merchant = await this.merchantsService.findByUser(userId);
    if (!merchant) return [];
    return this.repo.find({
      where: { merchantId: merchant.id },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}