import { Injectable } from '@nestjs/common';
import { InvalidParamsException } from 'src/exceptions/invalid-params.exception';
import { DeliverySlotsDetailsResponse } from './response/delivery-slots-details.response';
import { DeliverySlotsResponse } from './response/delivery-slots.response';

@Injectable()
export class DeliverySlotsService {
  getByTypeAndBetweenDate(
    type: string,
    startDate: string,
    endDate: string,
  ): DeliverySlotsResponse[] {
    if (type !== 'homeDelivery' && type !== 'clickAndCollect') {
      throw new InvalidParamsException(
        "type must be 'homeDelivery' or 'clickAndCollect'\"",
      );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      throw new InvalidParamsException(
        'startDate must be equal or before endDate',
      );
    }
    const results: DeliverySlotsResponse[] = [];
    const currentDate = new Date(start);
    const startString = start.toISOString().split('T')[0];
    while (currentDate <= end) {
      const result: DeliverySlotsResponse = new DeliverySlotsResponse();
      result.date = currentDate.toISOString().split('T')[0];
      if (type === 'homeDelivery') {
        result.slots = this.getSlotsForHomeDelivery(result.date, startString);
      } else {
        result.slots = this.getSlotsForClickAndCollect(
          result.date,
          startString,
        );
      }
      results.push(result);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return results;
  }

  getSlotsForHomeDelivery(currentDate: string, startDate: string) {
    const results: DeliverySlotsDetailsResponse[] = [];
    results.push(
      new DeliverySlotsDetailsResponse(
        '10:00',
        '12:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        70,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '12:00',
        '14:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        70,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '14:00',
        '16:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        70,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '16:00',
        '18:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        70,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '18:00',
        '20:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        70,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '20:00',
        '22:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        70,
        'THB',
      ),
    );
    return results;
  }

  getSlotsForClickAndCollect(currentDate: string, startDate: string) {
    const results: DeliverySlotsDetailsResponse[] = [];
    results.push(
      new DeliverySlotsDetailsResponse(
        '12:00',
        '14:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        0,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '14:00',
        '16:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        0,
        'THB',
      ),
    );
    results.push(
      new DeliverySlotsDetailsResponse(
        '16:00',
        '18:00',
        currentDate === startDate ? false : Math.random() < 0.8,
        0,
        'THB',
      ),
    );
    return results;
  }
}
