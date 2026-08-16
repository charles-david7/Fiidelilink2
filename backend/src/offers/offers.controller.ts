import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private service: OffersService) {}

  @Get() findAll() { return this.service.findActive(); }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyOffers(@Request() req) {
    return this.service.findByMerchant(req.user.id).then(async () => {
      const { MerchantsService } = await import('../merchants/merchants.service');
      // handled in service
      return this.service.findActive();
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: any) { return this.service.create(req.user.id, dto); }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.service.delete(id, req.user.id);
  }
}