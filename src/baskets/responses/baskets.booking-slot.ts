export class BasketBookingSlot {
  expire_datetime: Date;

  constructor(expireDateTime: Date) {
    this.expire_datetime = expireDateTime;
  }
}
