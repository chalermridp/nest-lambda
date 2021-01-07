import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductFilterDto } from './dto/products.filter.dto';
import { Product } from './products.model';
import { ProductsService } from './products.service';
import { ProductDetailsResponse } from './response/product-details.response';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Filtered Products' })
  getFiltered(@Query() filterDto: ProductFilterDto): Promise<Product[]> {
    return this.productsService.getFiltered(filterDto);
  }

  @Get('/:productId')
  @ApiOperation({ summary: 'Get Product Details' })
  async getById(
    @Param('productId') productId: string,
  ): Promise<ProductDetailsResponse> {
    return await this.productsService.getById(productId);
  }
}
