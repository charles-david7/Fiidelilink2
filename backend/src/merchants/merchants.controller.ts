import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('merchants')
export class MerchantsController {
  constructor(private service: MerchantsService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findById(id); }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  getMyMerchant(@Request() req) { return this.service.findByUser(req.user.id); }

  @UseGuards(JwtAuthGuard)
  @Get('me/dashboard')
  getDashboard(@Request() req) { return this.service.getDashboard(req.user.id); }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: any) { return this.service.create(req.user.id, dto); }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, req.user.id, dto);
  }
}