import { Module } from '@nestjs/common';
import { BasketsController } from './baskets.controller';
import { BasketsService } from './baskets.service';

@Module({
  controllers: [BasketsController],
  providers: [BasketsService],
})
export class BasketsModule {}
