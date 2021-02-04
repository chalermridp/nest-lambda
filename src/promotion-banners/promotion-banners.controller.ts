import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { PromotionBannersService } from './promotion-banners.service';
import { PromotionBannersResponse } from './response/promotion-banners.response';
import { PromotionBannersToggleResponse } from './response/promotion-banners.toggle.response';

@Controller('v1/promotion-banners')
export class PromotionBannersController {
  constructor(private promotionBannersService: PromotionBannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get Promotion Banners' })
  async get(): Promise<BaseResponse<PromotionBannersResponse>> {
    const data = await this.promotionBannersService.get();
    return new BaseResponse(200, 'success', data);
  }

  @Get('/toggle')
  @ApiOperation({ summary: 'Get Toggle Status of Promotion Banners' })
  getToggle(): BaseResponse<PromotionBannersToggleResponse> {
    return new BaseResponse(
      200,
      'success',
      this.promotionBannersService.getToggle(),
    );
  }

  @Post('/toggle')
  @ApiOperation({ summary: 'Switch Toggle Status of Promotion Banners' })
  switchToggle(): BaseResponse<PromotionBannersToggleResponse> {
    return new BaseResponse(
      200,
      'success',
      this.promotionBannersService.switchToggle(),
    );
  }
}
