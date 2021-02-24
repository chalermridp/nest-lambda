import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { PromotionBannersModule } from './promotion-banners/promotion-banners.module';
import { BasketsModule } from './baskets/baskets.module';
import { AccountsModule } from './accounts/accounts.module';
import { DeliverySlotsModule } from './delivery-slots/delivery-slots.module';

@Module({
  imports: [
    TerminusModule,
    HomeModule,
    CategoriesModule,
    ProductsModule,
    PromotionBannersModule,
    BasketsModule,
    AccountsModule,
    DeliverySlotsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
