import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MerchantsModule } from './merchants/merchants.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { OffersModule } from './offers/offers.module';
import { EventsModule } from './events/events.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    AuthModule, UsersModule, MerchantsModule,
    TransactionsModule, LoyaltyModule, OffersModule,
    EventsModule, SubscriptionsModule, AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
