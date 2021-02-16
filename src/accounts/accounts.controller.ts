import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { AccountsService } from './accounts.service';
import { AccountsDeliveryAddressUpdateDto } from './dto/accounts.delivery-address.update.dto';
import { AccountsAddressResponse } from './responses/accounts.address.response';

@Controller('v1/accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/:accountId/addresses/deliveries')
  async getDeliveryAddress(
    @Param('accountId') accountId: string,
  ): Promise<BaseResponse<AccountsAddressResponse[]>> {
    const data = await this.accountsService.getDeliveryAddress(accountId);
    return new BaseResponse(200, 'success', data);
  }

  @Put('/:accountId/addresses/deliveries/:uuid')
  async updateDeliveryAddress(
    @Param('accountId') accountId: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: AccountsDeliveryAddressUpdateDto,
  ): Promise<BaseResponse<AccountsAddressResponse>> {
    const data = await this.accountsService.updateDeliveryAddress(
      accountId,
      uuid,
      dto,
    );
    return new BaseResponse(200, 'success', data);
  }
}
