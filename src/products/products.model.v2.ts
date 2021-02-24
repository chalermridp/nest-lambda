import { ProductPrice } from './products-price.model';
import { ProductResource } from './products-resource.model';

export class ProductV2 {
  id: string;
  title: string;
  prices: ProductPrice[];
  resources: ProductResource[];
}
