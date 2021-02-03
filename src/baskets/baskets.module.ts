import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { BasketsController } from './baskets.controller';
import { BasketsService } from './baskets.service';

@Module({
  controllers: [BasketsController],
  providers: [BasketsService, ProductsService],
  imports: [ProductsModule]
})
export class BasketsModule {}
