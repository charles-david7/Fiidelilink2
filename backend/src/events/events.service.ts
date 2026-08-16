import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Registration } from './registration.entity';
import { MerchantsService } from '../merchants/merchants.service';
import * as crypto from 'crypto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    private merchantsService: MerchantsService,
  ) {}

  async findAll() {
    return this.eventRepo.find({
      where: { isActive: true },
      relations: ['merchant'],
      order: { eventDate: 'ASC' },
    });
  }

  async create(userId: string, dto: any) {
    const merchant = await this.merchantsService.findByUser(userId);
    if (!merchant) throw new ForbiddenException('Vous n`avez pas d`enseigne');
    const event = this.eventRepo.create({ ...dto, merchantId: merchant.id });
    return this.eventRepo.save(event);
  }

  async register(userId: string, eventId: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new BadRequestException('Événement introuvable');
    if (event.totalSlots > 0 && event.registeredCount >= event.totalSlots) {
      throw new BadRequestException('Plus de places disponibles');
    }
    const existing = await this.regRepo.findOne({ where: { userId, eventId } });
    if (existing) throw new BadRequestException('Vous êtes déjà inscrit');

    const qrToken = crypto.randomBytes(16).toString('hex');
    const reg = this.regRepo.create({ userId, eventId, qrToken });
    await this.regRepo.save(reg);
    await this.eventRepo.increment({ id: eventId }, 'registeredCount', 1);
    return { ...reg, event };
  }

  async getMyRegistrations(userId: string) {
    return this.regRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async getMerchantEvents(userId: string) {
    const merchant = await this.merchantsService.findByUser(userId);
    if (!merchant) return [];
    return this.eventRepo.find({ where: { merchantId: merchant.id }, order: { eventDate: 'ASC' } });
  }
}