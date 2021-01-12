import { Product } from '../products.model';

export class ProductsResponse {
  code: number;
  message: string;
  total: number;
  limit: number;
  offset: number;
  data: Product[];
  error: string;
}
