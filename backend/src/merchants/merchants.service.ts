import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant, MerchantStatus } from './merchant.entity';

@Injectable()
export class MerchantsService {
  constructor(@InjectRepository(Merchant) private repo: Repository<Merchant>) {}

  async create(userId: string, dto: any) {
    const merchant = this.repo.create({ ...dto, userId, status: MerchantStatus.PENDING });
    return this.repo.save(merchant);
  }

  async findAll() {
    return this.repo.find({ where: { status: MerchantStatus.ACTIVE }, order: { name: 'ASC' } });
  }

  async findByUser(userId: string) {
    return this.repo.findOne({ where: { userId } });
  }

  async findById(id: string) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Enseigne introuvable');
    return m;
  }

  async update(id: string, userId: string, dto: any) {
    const m = await this.findById(id);
    if (m.userId !== userId) throw new ForbiddenException();
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  async getDashboard(userId: string) {
    const merchant = await this.findByUser(userId);
    if (!merchant) return null;
    return {
      merchant,
      stats: {
        followers: merchant.followerCount,
        totalScans: merchant.totalScans,
        plan: merchant.plan,
        status: merchant.status,
      }
    };
  }

  async incrementScan(id: string) {
    await this.repo.increment({ id }, 'totalScans', 1);
  }

  async incrementFollowers(id: string, delta: number) {
    await this.repo.increment({ id }, 'followerCount', delta);
  }
}