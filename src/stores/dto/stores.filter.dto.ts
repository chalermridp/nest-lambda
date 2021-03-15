import { ApiProperty } from "@nestjs/swagger";

export class StoresFilterDto {
    @ApiProperty({
        required: false,
    })
    limit: number;
    @ApiProperty({
        required: false,
    })
    offset: number;
    @ApiProperty({
        required: false,
    })
    lang: string;
}