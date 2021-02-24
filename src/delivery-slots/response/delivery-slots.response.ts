import { DeliverySlotsDetailsResponse } from "./delivery-slots-details.response";

export class DeliverySlotsResponse {
    date: string;
    slots: DeliverySlotsDetailsResponse[];
}