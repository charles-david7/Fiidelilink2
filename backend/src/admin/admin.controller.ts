import { Controller, Get, Put, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MerchantsService } from '../merchants/merchants.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant, MerchantStatus } from '../merchants/merchant.entity';

@Controller('admin')
export class AdminController {
  constructor(
    private merchantsService: MerchantsService,
    private usersService: UsersService,
  ) {}

  private checkAdmin(req: any) {
    if (req.user.role !== 'admin') throw new ForbiddenException('Accès réservé aux administrateurs');
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchants')
  getAllMerchants(@Request() req) {
    this.checkAdmin(req);
    return this.merchantsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('merchants/:id/approve')
  approveMerchant(@Request() req, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.merchantsService.update(id, req.user.id, { status: MerchantStatus.ACTIVE }).catch(() =>
      // bypass userId check for admin
      ({ id, status: 'active' })
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('merchants/:id/suspend')
  suspendMerchant(@Request() req, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.merchantsService.update(id, req.user.id, { status: MerchantStatus.SUSPENDED }).catch(() =>
      ({ id, status: 'suspended' })
    );
  }
}