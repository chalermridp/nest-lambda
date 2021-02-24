import { HttpException, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "type must be \'homeDelivery\' or \'clickAndCollect\'" }',
        400,
      );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "startDate must be equal or before endDate" }',
        400,
      );
    }
    const results: DeliverySlotsResponse[] = [];
    const currentDate = start;
    while (currentDate <= end) {
      const result: DeliverySlotsResponse = new DeliverySlotsResponse();
      result.date = currentDate;
      if (type === 'homeDelivery') {
        result.slots = this.getSlotsForHomeDelivery(
          currentDate.getDate() === start.getDate(),
        );
      } else {
        result.slots = this.getSlotsForClickAndCollect(
          currentDate.getDate() === start.getDate(),
        );
      }
      results.push(result);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return results;
  }

  getSlotsForHomeDelivery(available: boolean) {
    const results: DeliverySlotsDetailsResponse[] = [];
    results.push(
      new DeliverySlotsDetailsResponse('10:00', '12:00', available, 70, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('12:00', '14:00', available, 70, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('14:00', '16:00', available, 70, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('16:00', '18:00', available, 70, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('18:00', '20:00', available, 70, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('20:00', '22:00', available, 70, 'THB'),
    );
    return results;
  }

  getSlotsForClickAndCollect(available: boolean) {
    const results: DeliverySlotsDetailsResponse[] = [];
    results.push(
      new DeliverySlotsDetailsResponse('12:00', '14:00', available, 0, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('14:00', '16:00', available, 0, 'THB'),
    );
    results.push(
      new DeliverySlotsDetailsResponse('16:00', '18:00', available, 0, 'THB'),
    );
    return results;
  }
}
