import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow/:merchantId')
  follow(@Request() req, @Param('merchantId') merchantId: string) {
    return this.service.follow(req.user.id, merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following')
  getFollowing(@Request() req) { return this.service.getFollowing(req.user.id); }

  @UseGuards(JwtAuthGuard)
  @Get('check/:merchantId')
  check(@Request() req, @Param('merchantId') merchantId: string) {
    return this.service.isFollowing(req.user.id, merchantId);
  }
}