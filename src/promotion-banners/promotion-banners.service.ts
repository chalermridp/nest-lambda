import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PromotionBannersResponse } from './response/promotion-banners.response';
import { PromotionBannersToggleResponse } from './response/promotion-banners.toggle.response';

@Injectable()
export class PromotionBannersService {
  private isActive = true;

  async get(): Promise<PromotionBannersResponse> {
    if (!this.isActive) {
      return {};
    }

    const response = await axios.get(
      'https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/promotion-banner/promotion-banner-data.json',
    );
    return response.data;
  }

  getToggle(): PromotionBannersToggleResponse {
    return new PromotionBannersToggleResponse(
      this.isActive ? 'active' : 'inactive',
    );
  }

  switchToggle(): PromotionBannersToggleResponse {
    this.isActive = !this.isActive;
    return this.getToggle();
  }
}
