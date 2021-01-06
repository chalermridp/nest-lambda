import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HotOffer } from './hot-offers.model';
import { HotOffersService } from './hot-offers.service';

@Controller('home/hot-offers')
export class HotOffersController {
  constructor(private hotOfferService: HotOffersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Hot-Offers' })
  async getAll(): Promise<HotOffer[]> {
    return this.hotOfferService.getAll();
  }
}
