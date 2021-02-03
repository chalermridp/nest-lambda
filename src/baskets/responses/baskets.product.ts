export class BasketProduct {
  id: string;
  original_price: number;
  discounted_price: number;
  unit_price: number;
  amount: number;
  total_price: number;
  name: string;
  unit_of_measure: String;
  min_amount: number;
  max_amount: number;
  image_url: string;
  optional: any[];
}