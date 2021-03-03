import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { ProductFilterDtoV2 } from './dto/products.filter.dto.v2';
import { ProductsGetByIdsDto } from './dto/products.get-by-ids.dto';
import { ProductsService } from './products.service';
import { ProductDetailsByIdsResponseV2 } from './response/product-details-by-ids.response.v2';
import { ProductDetailsResponseV2 } from './response/product-details.reponse.v2';
import { ProductsResponse } from './response/products.response';
import { ProductsResponseV2 } from './response/products.response.v2';

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

  @Get()
  @ApiOperation({ summary: 'Get Filtered Products V2' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async getFiltered(
    @Query() filterDto: ProductFilterDtoV2,
    @Query('lang') language: string,
  ) {
    const data = await this.productsService.getFilteredV2(filterDto, language);
    const response = new BaseResponse<ProductsResponse>(
      200,
      'success',
      data,
    );
    return response;
  }
}
