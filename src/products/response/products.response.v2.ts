import { ProductV2 } from "../products.model.v2";

export class ProductsResponseV2 {
    total: number;
    limit: number;
    offset: number;
    items: ProductV2[];
  }