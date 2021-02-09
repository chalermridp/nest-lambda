import { ProductCatchWeight } from 'src/products/response/product-catch-weight';

export class BasketProduct {
  id: string;
  original_price: number;
  discounted_price: number;
  unit_price: number;
  amount: number;
  total_price: number;
  name: string;
  unit_of_measure: string;
  catch_weight_list: ProductCatchWeight[];
  min_amount: number;
  max_amount: number;
  image_url: string;
  optional: any[];
}
