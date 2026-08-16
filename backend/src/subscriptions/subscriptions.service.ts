import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantFollow } from './merchant-follow.entity';
import { MerchantsService } from '../merchants/merchants.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(MerchantFollow) private repo: Repository<MerchantFollow>,
    private merchantsService: MerchantsService,
  ) {}

  async follow(userId: string, merchantId: string) {
    const existing = await this.repo.findOne({ where: { userId, merchantId } });
    if (existing) {
      await this.repo.delete(existing.id);
      await this.merchantsService.incrementFollowers(merchantId, -1);
      return { following: false, message: 'Désabonné' };
    }
    const follow = this.repo.create({ userId, merchantId });
    await this.repo.save(follow);
    await this.merchantsService.incrementFollowers(merchantId, 1);
    return { following: true, message: 'Abonné' };
  }

  async getFollowing(userId: string) {
    const follows = await this.repo.find({ where: { userId } });
    const merchantIds = follows.map(f => f.merchantId);
    if (!merchantIds.length) return [];
    return Promise.all(merchantIds.map(id => this.merchantsService.findById(id).catch(() => null)))
      .then(ms => ms.filter(Boolean));
  }

  async isFollowing(userId: string, merchantId: string) {
    const f = await this.repo.findOne({ where: { userId, merchantId } });
    return { following: !!f };
  }
}