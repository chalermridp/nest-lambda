import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HotOffer } from './hot-offers.model';

@Injectable()
export class HotOffersService {
  private hotOffers = [];
  async getAll(): Promise<HotOffer[]> {
    const response = await axios.get(
      'https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/hot-offers.json',
    );
    this.hotOffers = response.data.map((value) => {
      return value;
    });
    return this.hotOffers;
  }
}
