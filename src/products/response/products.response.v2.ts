import { ProductV2 } from "../products.model.v2";
import { ProductDetailsResponseV2 } from "./product-details.reponse.v2";

export class ProductsResponseV2 {
    total: number;
    limit: number;
    offset: number;
    items: ProductDetailsResponseV2[];
  }