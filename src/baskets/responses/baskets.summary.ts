import { BasketProduct } from './baskets.product';

export class BasketSummary {
  items: number;
  guide_price: number;
  saved: number;
  order_total: number;
  free_delivery_threshold: number;
  free_delivery_hint_text: string;

  constructor(basketProducts: BasketProduct[], language: string) {
    if (basketProducts.length > 0) {
      this.items = basketProducts
        .map((i) => i.amount)
        .reduce((sum, current) => sum + current);
      this.guide_price = basketProducts
        .map((i) => i.original_price * i.amount)
        .reduce((sum, current) => sum + current);
      this.saved = basketProducts
        .map((i) => i.discounted_price * i.amount)
        .reduce((sum, current) => sum + current);
      this.order_total = basketProducts
        .map((i) => i.unit_price * i.amount)
        .reduce((sum, current) => sum + current);
    } else {
      this.items = 0;
      this.guide_price = 0;
      this.saved = 0;
      this.order_total = 0;
    }

    this.free_delivery_threshold = 500;
    this.free_delivery_hint_text = '';
    if (this.order_total < this.free_delivery_threshold) {
      this.free_delivery_hint_text = 'Purchase 500.00 baht for free delivery';
      if (language == 'th') {
        this.free_delivery_hint_text = 'ซื้อครบ 500.00 บาท ฟรีค่าจัดส่ง';
      }
    }
  }
}
