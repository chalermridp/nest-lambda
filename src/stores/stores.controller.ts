import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { StoresFilterDto } from './dto/stores.filter.dto';
import { StoresResponse } from './response/stores.response';
import { StoresService } from './stores.service';

@Controller('v1/stores')
export class StoresController {
    constructor(private storesService: StoresService) {
        this.storesService = storesService;
    }

    @Get('/nearest')
    async getNearest(@Query() filterDto: StoresFilterDto) {
        const data = await this.storesService.getNearest(filterDto);
        const response = new BaseResponse<StoresResponse>(200, 'success', data);
        return response;
    }
}
