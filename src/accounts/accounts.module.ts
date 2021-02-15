import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { S3FileHelper } from 'src/common/utilities/s3-file-helper';

@Module({
  providers: [AccountsService, S3FileHelper],
  controllers: [AccountsController],
})
export class AccountsModule {}
