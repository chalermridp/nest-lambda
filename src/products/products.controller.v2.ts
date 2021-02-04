import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { ProductsService } from './products.service';
import { ProductDetailsResponseV2 } from './response/product-details.reponse.v2';

@Controller('v2/products')
export class ProductsControllerV2 {
  constructor(private productsService: ProductsService) {}

  @Get('/:productId')
  @ApiOperation({ summary: 'Get Product Details V2' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async getById(
    @Param('productId') productId: string,
    @Query('lang') language: string,
  ): Promise<BaseResponse<ProductDetailsResponseV2>> {
    const data = await this.productsService.getByIdV2(productId, language);
    const response = new BaseResponse<ProductDetailsResponseV2>(
      200,
      'success',
      data,
    );
    return response;
  }
}
