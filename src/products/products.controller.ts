import { Controller, Get, Query } from '@nestjs/common';
import { ProductFilterDto } from './dto/products.filter.dto';
import { Product } from './products.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getFiltered(@Query() filterDto: ProductFilterDto): Promise<Product[]> {
    return this.productsService.getFiltered(filterDto);
  }
}
