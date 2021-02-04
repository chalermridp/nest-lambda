import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { BasketsService } from './baskets.service';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { ProductBasketUpdateDto } from './dto/product-baskets.update.dto';
import { BasketProduct } from './responses/baskets.product';
import { BasketsResponse } from './responses/baskets.response';

@Controller('v1/baskets')
export class BasketsController {
  constructor(private basketsService: BasketsService) {}

  @Get('/:basketId')
  @ApiOperation({ summary: 'Get Basket by Id' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async getById(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
  ) {
    const data = await this.basketsService.getById(basketId, language);
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }

  @Patch('/:basketId')
  @ApiOperation({ summary: 'Update Basket' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async updateById(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
    @Body() basketUpdateDto: BasketUpdateDto,
  ) {
    const data = await this.basketsService.updateById(
      basketId,
      language,
      basketUpdateDto,
    );
    const response = new BaseResponse<BasketsResponse>(200, 'success', data);
    return response;
  }

  @Post('/:basketId/products')
  @ApiOperation({ summary: 'Update Product in Basket' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async updateBasketProduct(
    @Param('basketId') basketId: string,
    @Query('lang') language: string,
    @Body() updateBasketProductDto: ProductBasketUpdateDto,
  ) {
    const data = await this.basketsService.updateBasketProduct(
      basketId,
      language,
      updateBasketProductDto,
    );
    const response = new BaseResponse<BasketProduct>(200, 'success', data);
    return response;
  }
}
