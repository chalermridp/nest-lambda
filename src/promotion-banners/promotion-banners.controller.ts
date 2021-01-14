import { Controller, Get, Post } from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { PromotionBannersService } from './promotion-banners.service';
import { PromotionBannersResponse } from './response/promotion-banners.response';
import { PromotionBannersToggleResponse } from './response/promotion-banners.toggle.response';

@Controller('v1/promotion-banners')
export class PromotionBannersController {
  constructor(private promotionBannersService: PromotionBannersService) {}

  @Get()
  async get(): Promise<BaseResponse<PromotionBannersResponse>> {
    const data = await this.promotionBannersService.get();
    return new BaseResponse(200, 'success', data);
  }

  @Get('/toggle')
  getToggle(): BaseResponse<PromotionBannersToggleResponse> {
    return new BaseResponse(
      200,
      'success',
      this.promotionBannersService.getToggle(),
    );
  }

  @Post('/toggle')
  switchToggle(): BaseResponse<PromotionBannersToggleResponse> {
    return new BaseResponse(
      200,
      'success',
      this.promotionBannersService.switchToggle(),
    );
  }
}
