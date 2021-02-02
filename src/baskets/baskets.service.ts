import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BasketNotFoundException } from 'src/exceptions/basket-not-found.exception';
import { BasketsResponse } from './responses/baskets.response';

@Injectable()
export class BasketsService {
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
        return value;
      });

    if (baskets.length === 0) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }
    return baskets[0];
  }
}
