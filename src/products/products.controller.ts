import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
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
    const response = new BaseResponse<ProductsResponse>();
    response.code = 200;
    response.message = 'success';
    response.data = await this.productsService.getFiltered(filterDto);
    return response;
  }

  @Get('/:productId')
  @ApiOperation({ summary: 'Get Product Details' })
  getById(
    @Param('productId') productId: string,
    @Query('lang') language: string,
  ): Promise<ProductDetailsResponse> {
    return this.productsService.getById(productId, language);
  }
}
