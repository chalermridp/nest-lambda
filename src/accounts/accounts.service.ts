import { Injectable } from '@nestjs/common';
import { S3FileHelper } from 'src/common/utilities/s3-file-helper';
import { AccountNotFoundException } from 'src/exceptions/account-not-found.exception';
import { AdddressNotFoundException } from 'src/exceptions/address-not-found.exception';
import { AccountsAddressUpdateDto } from './dto/accounts.address.update.dto';
import { AccountsAddressResponse } from './responses/accounts.address.response';

@Injectable()
export class AccountsService {
  constructor(private s3FileHelper: S3FileHelper) {}

  private BUCKET_NAME = 'oh-shopping-online';
  private ACCOUNT_FOLDER_NAME = 'accounts';

  async getAddresses(accountId: string): Promise<AccountsAddressResponse[]> {
    const accountAddressesInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.ACCOUNT_FOLDER_NAME}/${accountId}/addresses.json`,
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

  async updateAddress(
    accountId: string,
    uuid: string,
    updateAddressDto: AccountsAddressUpdateDto,
  ): Promise<AccountsAddressResponse> {
    const addresses = await this.getAddresses(accountId);
    const address = addresses.find((i) => i.uuid === uuid);
    if (!address) {
      throw new AdddressNotFoundException(
        'address_not_found',
        'address does not exist',
      );
    }
    address.place_name = updateAddressDto.place_name;
    address.recipient = updateAddressDto.recipient;
    address.address_number = updateAddressDto.address_number;
    address.moo_soi_road = updateAddressDto.moo_soi_road;
    address.province = updateAddressDto.province;
    address.district = updateAddressDto.district;
    address.subdistrict = updateAddressDto.subdistrict;
    address.state = updateAddressDto.state;
    address.city = updateAddressDto.city;
    address.area = updateAddressDto.area;
    address.postal_code = updateAddressDto.postal_code;
    address.contact_number = updateAddressDto.contact_number;
    address.note_to_delivery = updateAddressDto.note_to_delivery;
    address.updated_at = new Date();

    const content = JSON.stringify(addresses);
    await this.s3FileHelper.uploadPublicFile(
      this.BUCKET_NAME,
      `${this.ACCOUNT_FOLDER_NAME}/${accountId}/addresses.json`,
      Buffer.from(content, 'utf8'),
    );
    return address;
  }
}
