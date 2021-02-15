import { Injectable } from '@nestjs/common';
import { S3FileHelper } from 'src/common/utilities/s3-file-helper';
import { AccountNotFoundException } from 'src/exceptions/account-not-found.exception';
import { AdddressNotFoundException } from 'src/exceptions/address-not-found.exception';
import { AccountsDeliveryAddressUpdateDto } from './dto/accounts.delivery-address.update.dto';
import { AccountsAddressResponse } from './responses/accounts.address.response';

@Injectable()
export class AccountsService {
  constructor(private s3FileHelper: S3FileHelper) {}

  private BUCKET_NAME = 'oh-shopping-online';
  private ACCOUNT_FOLDER_NAME = 'accounts';

  async getDeliveryAddress(
    accountId: string,
  ): Promise<AccountsAddressResponse[]> {
    const accountAddressesInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.ACCOUNT_FOLDER_NAME}/${accountId}/addresses/deliveries.json`,
    );
    if (!accountAddressesInS3) {
      throw new AccountNotFoundException(
        'account_not_found',
        'account does not exist',
      );
    }

    const addresses: AccountsAddressResponse[] = JSON.parse(
      accountAddressesInS3,
    );

    return addresses;
  }

  async updateDeliveryAddress(
    accountId: string,
    uuid: string,
    dto: AccountsDeliveryAddressUpdateDto,
  ): Promise<AccountsAddressResponse> {
    const addresses = await this.getDeliveryAddress(accountId);
    const address = addresses.find((i) => i.uuid === uuid);
    if (!address) {
      throw new AdddressNotFoundException(
        'address_not_found',
        'address does not exist',
      );
    }
    address.place_name = dto.place_name;
    address.recipient = dto.recipient;
    address.address_number = dto.address_number;
    address.moo_soi_road = dto.moo_soi_road;
    address.province = dto.province;
    address.district = dto.district;
    address.subdistrict = dto.subdistrict;
    address.state = dto.state;
    address.city = dto.city;
    address.area = dto.area;
    address.postal_code = dto.postal_code;
    address.contact_number = dto.contact_number;
    address.note_to_delivery = dto.note_to_delivery;
    address.updated_at = new Date();

    const content = JSON.stringify(addresses);
    await this.s3FileHelper.uploadPublicFile(
      this.BUCKET_NAME,
      `${this.ACCOUNT_FOLDER_NAME}/${accountId}/addresses/deliveries.json`,
      Buffer.from(content, 'utf8'),
    );
    return address;
  }
}
