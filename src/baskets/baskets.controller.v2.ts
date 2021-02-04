import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { BasketsServiceV2 } from './baskets.service.v2';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { ProductBasketCreateDto } from './dto/product-baskets.create.dto';
import { BasketProduct } from './responses/baskets.product';
import { BasketsResponse } from './responses/baskets.response';

@Controller('v2/baskets')
export class BasketsControllerV2 {
  constructor(private basketsService2: BasketsServiceV2) {}
  @Get('/:basketId')
  async getById(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
  ) {
    const data = await this.basketsService2.getById(basketId, language);
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }

  @Patch('/:basketId')
  async updateById(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
    @Body() basketUpdateDto: BasketUpdateDto,
  ) {
    const data = await this.basketsService2.updateById(
      basketId,
      language,
      basketUpdateDto,
    );
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }

  @Post('/:basketId/products')
  async addProductToBasket(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
    @Body() addProductToBasketDto: ProductBasketCreateDto,
  ) {
    const data = await this.basketsService2.addProductToBasket(
      basketId,
      language,
      addProductToBasketDto,
    );
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }
}
