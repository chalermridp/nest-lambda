import { ApiProperty } from '@nestjs/swagger';
import { ProductBasketUpdateDto } from './product-baskets.update.dto';

export class BasketUpdateDto {
  products: ProductBasketUpdateDto[];
}

