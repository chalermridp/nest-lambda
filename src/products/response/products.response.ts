import { Product } from '../products.model';

export class ProductsResponse {
  total: number;
  limit: number;
  offset: number;
  items: Product[];
}
