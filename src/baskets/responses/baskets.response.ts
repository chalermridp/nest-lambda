import { Get } from "@nestjs/common";
import { BasketProduct } from "./baskets.product";
import { BasketSummary } from "./baskets.summary";

export class BasketsResponse {
  products: BasketProduct[];
  summary: BasketSummary;
}
