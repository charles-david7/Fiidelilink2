import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { IsString, IsNumber, Min } from 'class-validator';

class ScanDto {
  @IsString() merchantId: string;
  @IsNumber() @Min(0.01) amount: number;
}

@Controller('transactions')
export class TransactionsController {
  constructor(private service: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('scan')
  scan(@Request() req, @Body() dto: ScanDto) {
    return this.service.scan(req.user.id, dto.merchantId, dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyTransactions(@Request() req) {
    return this.service.getMyTransactions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('merchant')
  getMerchantTransactions(@Request() req) {
    return this.service.getMerchantTransactions(req.user.id);
  }
}