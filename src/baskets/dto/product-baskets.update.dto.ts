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

  @ApiProperty({
    required: true,
    default: 'Each',
  })
  unit_of_measure: string;

  @ApiProperty({
    required: false,
  })
  created_at: Date;
}
