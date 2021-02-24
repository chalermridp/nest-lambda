import { DeliverySlotsDetailsResponse } from './delivery-slots-details.response';

export class DeliverySlotsResponse {
  date: Date;
  slots: DeliverySlotsDetailsResponse[];
}
