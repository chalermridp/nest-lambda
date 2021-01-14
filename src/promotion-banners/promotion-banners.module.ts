import { Module } from '@nestjs/common';
import { PromotionBannersService } from './promotion-banners.service';
import { PromotionBannersController } from './promotion-banners.controller';

@Module({
  providers: [PromotionBannersService],
  controllers: [PromotionBannersController],
})
export class PromotionBannersModule {}
