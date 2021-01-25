import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsControllerV2 } from './products.controller.v2';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController, ProductsControllerV2],
  providers: [ProductsService],
})
export class ProductsModule {}
