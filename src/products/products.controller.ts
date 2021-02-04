import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/base.response';
import { ProductFilterDto } from './dto/products.filter.dto';
import { ProductsService } from './products.service';
import { ProductDetailsResponse } from './response/product-details.response';
import { ProductsResponse } from './response/products.response';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Filtered Products' })
  async getFiltered(
    @Query() filterDto: ProductFilterDto,
  ): Promise<BaseResponse<ProductsResponse>> {
    const data = await this.productsService.getFiltered(filterDto);
    const response = new BaseResponse<ProductsResponse>(200, 'success', data);
    return response;
  }

  @Get('/:productId')
  @ApiOperation({ summary: 'Get Product Details' })
  @ApiQuery({ name: 'lang', required: false, enum: ['en', 'th'] })
  async getById(
    @Param('productId') productId: string,
    @Query('lang') language: string,
  ): Promise<BaseResponse<ProductDetailsResponse>> {
    const data = await this.productsService.getById(productId, language);
    const response = new BaseResponse<ProductDetailsResponse>(
      200,
      'success',
      data,
    );
    return response;
  }
}
