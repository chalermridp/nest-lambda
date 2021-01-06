import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProductFilterDto } from './dto/products.filter.dto';
import { Product } from './products.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Filtered Products' })
  getFiltered(@Query() filterDto: ProductFilterDto): Promise<Product[]> {
    return this.productsService.getFiltered(filterDto);
  }
}
