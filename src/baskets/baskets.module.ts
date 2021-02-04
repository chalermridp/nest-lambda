import { Module } from '@nestjs/common';
import { S3FileHelper } from 'src/common/utilities/s3-file-helper';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { BasketsController } from './baskets.controller';
import { BasketsControllerV2 } from './baskets.controller.v2';
import { BasketsService } from './baskets.service';
import { BasketsServiceV2 } from './baskets.service.v2';

@Module({
  controllers: [BasketsController, BasketsControllerV2],
  providers: [BasketsService, BasketsServiceV2, ProductsService, S3FileHelper],
  imports: [ProductsModule],
})
export class BasketsModule {}
