import { ApiProperty } from '@nestjs/swagger';

export class ProductFilterDto {
  @ApiProperty({
    required: false,
  })
  categoryLevel1: string;

  @ApiProperty({
    required: false,
  })
  categoryLevel2: string;

  @ApiProperty({
    required: false,
  })
  categoryLevel3: string;

  @ApiProperty({
    description: 'The product keyword use for filter in product name EN/TH',
    example: 'water',
    required: false,
  })
  keyword: string;
}
