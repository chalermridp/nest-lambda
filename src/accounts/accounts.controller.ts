import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { BaseResponse } from 'src/common/responses/base.response';
import { AccountsService } from './accounts.service';
import { AccountsAddressUpdateDto } from './dto/accounts.address.update.dto';
import { AccountsAddressResponse } from './responses/accounts.address.response';

@Controller('v1/accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/:accountId/addresses')
  async getAddresses(
    @Param('accountId') accountId: string,
  ): Promise<BaseResponse<AccountsAddressResponse[]>> {
    const data = await this.accountsService.getAddresses(accountId);
    return new BaseResponse(200, 'success', data);
  }

  @Put('/:accountId/addresses/:uuid')
  async updateAddresses(
    @Param('accountId') accountId: string,
    @Param('uuid') uuid: string,
    @Body() updateAddressDto: AccountsAddressUpdateDto,
  ): Promise<BaseResponse<AccountsAddressResponse>> {
    const data = await this.accountsService.updateAddress(
      accountId,
      uuid,
      updateAddressDto,
    );
    return new BaseResponse(200, 'success', data);
  }
}
