import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { BasketsServiceV2 } from './baskets.service.v2';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { ProductBasketUpdateDto } from './dto/product-baskets.update.dto';
import { BasketsResponse } from './responses/baskets.response';

@Controller('v2/baskets')
export class BasketsControllerV2 {
  constructor(private basketsService2: BasketsServiceV2) {}

  @Get('/:basketId')
  @ApiOperation({ summary: 'Get Basket by Id V2' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async getById(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
  ) {
    const data = await this.basketsService2.getById(basketId, language);
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }

  @Patch('/:basketId')
  @ApiOperation({ summary: 'Update Basket V2' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
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
  @ApiOperation({ summary: 'Update Product in Basket V2' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async updateBasketProduct(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
    @Body() updateBasketProductDto: ProductBasketUpdateDto,
  ) {
    const data = await this.basketsService2.updateBasketProduct(
      basketId,
      language,
      updateBasketProductDto,
    );
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }
}
