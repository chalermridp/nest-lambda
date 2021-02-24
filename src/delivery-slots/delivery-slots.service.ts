import { Injectable } from '@nestjs/common';
import { DeliverySlotsResponse } from './response/delivery-slots.response';

@Injectable()
export class DeliverySlotsService {
    getByTypeAndBetweenDate(type: string, startDate: string, endDate: string): DeliverySlotsResponse[] {
        throw new Error('Method not implemented.');
    }
}
