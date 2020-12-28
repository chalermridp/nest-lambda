import { Controller, Get } from '@nestjs/common';
import { HotOffer } from './hot-offers.model';
import { HotOffersService } from './hot-offers.service';

@Controller('hot-offers')
export class HotOffersController {
  constructor(private hotOfferService: HotOffersService) {}

  @Get()
  async getAll(): Promise<HotOffer[]> {
    return this.hotOfferService.getAll();
  }
}
