import { Injectable } from '@nestjs/common';
import { S3FileHelper } from 'src/common/utilities/s3-file-helper';
import { AccountNotFoundException } from 'src/exceptions/account-not-found.exception';
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
}
