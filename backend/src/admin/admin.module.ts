import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MerchantsModule } from '../merchants/merchants.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MerchantsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}