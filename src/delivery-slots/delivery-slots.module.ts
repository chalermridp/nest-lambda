import { Module } from '@nestjs/common';
import { DeliverySlotsService } from './delivery-slots.service';
import { DeliverySlotsController } from './delivery-slots.controller';

@Module({
  providers: [DeliverySlotsService],
  controllers: [DeliverySlotsController]
})
export class DeliverySlotsModule {}
