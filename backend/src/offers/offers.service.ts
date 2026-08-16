import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Offer } from './offer.entity';
import { MerchantsService } from '../merchants/merchants.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private repo: Repository<Offer>,
    private merchantsService: MerchantsService,
  ) {}

  async findActive() {
    return this.repo.find({
      where: { isActive: true },
      relations: ['merchant'],
      order: { isSponsored: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByMerchant(merchantId: string) {
    return this.repo.find({ where: { merchantId }, order: { createdAt: 'DESC' } });
  }

  async create(userId: string, dto: any) {
    const merchant = await this.merchantsService.findByUser(userId);
    if (!merchant) throw new ForbiddenException('Vous n`avez pas d`enseigne');
    const offer = this.repo.create({ ...dto, merchantId: merchant.id });
    return this.repo.save(offer);
  }

  async update(id: string, userId: string, dto: any) {
    const merchant = await this.merchantsService.findByUser(userId);
    const offer = await this.repo.findOne({ where: { id } });
    if (!offer || offer.merchantId !== merchant?.id) throw new ForbiddenException();
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string, userId: string) {
    const merchant = await this.merchantsService.findByUser(userId);
    const offer = await this.repo.findOne({ where: { id } });
    if (!offer || offer.merchantId !== merchant?.id) throw new ForbiddenException();
    await this.repo.delete(id);
    return { message: 'Offre supprimée' };
  }
}