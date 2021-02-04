import { ApiProperty } from '@nestjs/swagger';
import { ProductBasketUpdateDto } from './product-baskets.update.dto';

export class BasketUpdateDto {
  @ApiProperty({
    required: true,
  })
  products: ProductBasketUpdateDto[];
}
