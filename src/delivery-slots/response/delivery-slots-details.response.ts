export class DeliverySlotsDetailsResponse {
  from: string;
  to: string;
  available: boolean;
  cost: number;
  currency: string;

  constructor(
    from: string,
    to: string,
    available: boolean,
    cost: number,
    currency: string,
  ) {
    this.from = from;
    this.to = to;
    this.available = available;
    this.cost = cost;
    this.currency = currency;
  }
}
