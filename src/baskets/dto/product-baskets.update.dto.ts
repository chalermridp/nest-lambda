import { ApiProperty } from '@nestjs/swagger';

export class ProductBasketUpdateDto {
  @ApiProperty({
    required: true,
  })
  id: string;

  @ApiProperty({
    required: true,
  })
  amount: number;
}
