import { ApiProperty } from '@nestjs/swagger';

export class ProductFilterDtoV2 {
  @ApiProperty({
    required: true,
  })
  ids: string;

  @ApiProperty({
    required: false,
  })
  limit: number;
  @ApiProperty({
    required: false,
  })
  offset: number;
}
