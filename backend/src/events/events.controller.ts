import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private service: EventsService) {}

  @Get() findAll() { return this.service.findAll(); }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: any) { return this.service.create(req.user.id, dto); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  register(@Request() req, @Param('id') id: string) {
    return this.service.register(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/registrations')
  getMyRegistrations(@Request() req) { return this.service.getMyRegistrations(req.user.id); }

  @UseGuards(JwtAuthGuard)
  @Get('my/merchant')
  getMerchantEvents(@Request() req) { return this.service.getMerchantEvents(req.user.id); }
}