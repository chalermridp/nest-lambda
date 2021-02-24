import { Query } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { DeliverySlotsService } from './delivery-slots.service';
import { DeliverySlotsResponse } from './response/delivery-slots.response';

@Controller('v1/delivery-slots')
export class DeliverySlotsController {
  constructor(private deliverySlotsService: DeliverySlotsService) {}

  @Get()
  get(
    @Query('type') type: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): BaseResponse<DeliverySlotsResponse[]> {
    const data = this.deliverySlotsService.getByTypeAndBetweenDate(
      type,
      startDate,
      endDate,
    );
    const response = new BaseResponse<DeliverySlotsResponse[]>(
      200,
      'success',
      data,
    );
    return response;
  }
}
