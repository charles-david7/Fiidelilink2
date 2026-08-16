import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoyaltyService } from './loyalty.service';
import { UsersService } from '../users/users.service';

@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private loyaltyService: LoyaltyService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('balances')
  getBalances(@Request() req) {
    return this.loyaltyService.getBalancesByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balances/:merchantId')
  getBalance(@Request() req, @Param('merchantId') merchantId: string) {
    return this.loyaltyService.getBalanceForMerchant(req.user.id, merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('convert')
  async convert(@Request() req, @Body() body: { merchantId: string; peAmount: number }) {
    const result = await this.loyaltyService.convert(req.user.id, body.merchantId, body.peAmount);
    if (result.success) {
      await this.usersService.updateUniversalPoints(req.user.id, result.puGained);
    }
    return result;
  }
}