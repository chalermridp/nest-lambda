import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BasketNotFoundException } from 'src/exceptions/basket-not-found.exception';
import { ProductsService } from 'src/products/products.service';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { ProductBasketCreateDto } from './dto/product-baskets.create.dto';
import { ProductBasketUpdateDto } from './dto/product-baskets.update.dto';
import { BasketProduct } from './responses/baskets.product';
import { BasketsResponse } from './responses/baskets.response';
import { BasketSummary } from './responses/baskets.summary';

@Injectable()
export class BasketsService {
  private baskets: { [id: string]: BasketsResponse } = {};
  constructor(private productsService: ProductsService) {
    this.baskets[1] = new BasketsResponse();
    this.baskets[1].products = [];
  }

  private productBasketUpdateDtoDic: { [basketId: string]: ProductBasketUpdateDto[] } = {};

  async getById(basketId: string, language: string): Promise<BasketsResponse> {
    if (typeof language === 'undefined') {
      language = 'en';
    }
    if (language !== 'en' && language !== 'th') {
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "language must be \'en\' or \'th\'" }',
        400,
      );
    }

    const response = await axios.get(
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/basket/baskets_v1_${language}.json`,
    );
    const baskets: BasketsResponse[] = response.data
      .filter((i) => i.basket.id === basketId)
      .map((value) => {
        return value.basket;
      });

    if (baskets.length === 0) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    let basket = baskets[0];
    const basketUpdateDto = this.productBasketUpdateDtoDic[basketId];
    if (basketUpdateDto) {
      basket.products = basket.products.filter(value => basketUpdateDto.map(i => i.id).includes(value.id));
      basket.products.map(value => {
        value.amount = basketUpdateDto.find(i => i.id === value.id).amount;
        value.total_price = value.unit_price * value.amount;
      })
    }
    basket.summary = new BasketSummary(basket.products);
    return basket;
  }

  async updateById(basketId: string, language: string, basketUpdateDto: BasketUpdateDto): Promise<BasketsResponse> {
    this.productBasketUpdateDtoDic[basketId] = basketUpdateDto.products;
    return await this.getById(basketId, language);
  }

  async addProductToBasket(basketId: string, language: string, addProductToBasketDto: ProductBasketCreateDto) {
    const basket = this.baskets[basketId];
    if (typeof basket === 'undefined') {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    const existingBasketProduct = basket.products.find(i => i.id === addProductToBasketDto.id);
    if (existingBasketProduct) {
      existingBasketProduct.amount += addProductToBasketDto.amount;
      existingBasketProduct.total_price = existingBasketProduct.unit_price * existingBasketProduct.amount;
    }
    else {
      const response = await this.productsService.getByIdV2(addProductToBasketDto.id, language);
      const product = response.product;
      const productPrice = response.product.prices.find(i => i.unit_of_measure === 'Each') || response.product.prices[0];
      let basketProduct = new BasketProduct();
      basketProduct.id = product.id;
      basketProduct.name = product.title;
      basketProduct.original_price = productPrice.original_price;
      basketProduct.discounted_price = productPrice.discounted_price;
      basketProduct.unit_price = productPrice.unit_price;
      basketProduct.unit_of_measure = productPrice.unit_of_measure;
      basketProduct.amount = addProductToBasketDto.amount;
      basketProduct.total_price = basketProduct.unit_price * basketProduct.amount;
      basketProduct.min_amount = 0;
      basketProduct.max_amount = 10;
      basketProduct.image_url = product.resources[0].url;
      const optional = this.getOptionalFields(basketProduct.id);
      if (optional) {
        basketProduct.optional = [];
        basketProduct.optional.push(optional)
      }
      basket.products.push(basketProduct);
    }
    basket.summary = new BasketSummary(basket.products);
    return basket;
  }

  getOptionalFields(productId: string): any {
    if (+productId % 4 === 0) {
      return { missed_promotion_text: "Missed promotion ! This product was ฿39.00 until 23 Dec. 2020" };
    } else if (+productId % 3 === 0) {
      return { remove_some_item_text: "or remove some of this item to check out" };
    } else if (+productId % 2 === 0) {
      return {
        missed_promotion_text: "Missed promotion ! This product was ฿39.00 until 23 Dec. 2020",
        remove_some_item_text: "or remove some of this item to check out"
      };
    } else {
      return null;
    }
  }
}
