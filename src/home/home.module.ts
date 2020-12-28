import { Module } from '@nestjs/common';
import { HotOffersController } from './hot-offers/hot-offers.controller';
import { HotOffersService } from './hot-offers/hot-offers.service';
import { HotSellingBrandsController } from './hot-selling-brands/hot-selling-brands.controller';
import { HotSellingBrandsService } from './hot-selling-brands/hot-selling-brands.service';

@Module({
  imports: [],
  controllers: [HotOffersController, HotSellingBrandsController],
  providers: [HotOffersService, HotSellingBrandsService],
})
export class HomeModule {}
