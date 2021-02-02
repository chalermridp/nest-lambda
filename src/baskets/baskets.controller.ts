import { Controller, Get, Param, Query } from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { BasketsService } from './baskets.service';
import { BasketsResponse } from './responses/baskets.response';

@Controller('v1/baskets')
export class BasketsController {
  constructor(private basketsService: BasketsService) {}

  @Get('/:basketId')
  async getById(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
  ) {
    const data = await this.basketsService.getById(basketId, language);
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }
}
