import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BasketNotFoundException } from 'src/exceptions/basket-not-found.exception';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { ProductBasketUpdateDto } from './dto/product-baskets.update.dto';
import { BasketsResponse } from './responses/baskets.response';
import { BasketSummary } from './responses/baskets.summary';

@Injectable()
export class BasketsService {
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
}
