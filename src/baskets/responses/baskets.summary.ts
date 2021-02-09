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
      const eachProducts = basketProducts.filter(
        (i) => i.unit_of_measure === 'Each',
      );
      const eachProductCount =
        eachProducts.length < 1
          ? 0
          : eachProducts
              .map((i) => i.amount)
              .reduce((sum, current) => sum + current);
      const kgProductCount = basketProducts.filter(
        (i) => i.unit_of_measure === 'Kg',
      ).length;

      this.items = eachProductCount + kgProductCount;
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

    this.free_delivery_threshold = 1000;
    this.free_delivery_hint_text = '';
    if (this.order_total === 0) {
      const condition = this.free_delivery_threshold.toLocaleString('en');

      this.free_delivery_hint_text = `Purchase ${condition} Baht for free delivery`;
      if (language === 'th') {
        this.free_delivery_hint_text = `ช็อปครบ ${condition} บาท ฟรีค่าจัดส่ง`;
      }
    } else if (this.order_total < this.free_delivery_threshold) {
      const condition = (
        this.free_delivery_threshold - this.order_total
      ).toLocaleString('en');

      this.free_delivery_hint_text = `Purchase ฿ ${condition} more for free delivery`;
      if (language === 'th') {
        this.free_delivery_hint_text = `ช็อปเพิ่มอีก ${condition} บาท ฟรีค่าจัดส่ง`;
      }
    }
  }
}
