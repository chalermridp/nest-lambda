import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BasketNotFoundException } from 'src/exceptions/basket-not-found.exception';
import { ProductsService } from 'src/products/products.service';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { ProductBasketUpdateDto } from './dto/product-baskets.update.dto';
import { BasketProduct } from './responses/baskets.product';
import { BasketsResponse } from './responses/baskets.response';
import { BasketSummary } from './responses/baskets.summary';

@Injectable()
export class BasketsService {
  private baskets: { [id: string]: BasketsResponse } = {};
  constructor(private productsService: ProductsService) {
    this.baskets['1'] = new BasketsResponse();
    this.baskets['1'].products = [];

    this.baskets['2'] = new BasketsResponse();
    this.baskets['2'].products = [];
    this.updateBasketProduct('2', 'en', {
      id: '99010101',
      amount: 3,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010102',
      amount: 7,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010103',
      amount: 4,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010104',
      amount: 11,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010105',
      amount: 23,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010106',
      amount: 50,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010107',
      amount: 3,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
    this.updateBasketProduct('2', 'en', {
      id: '99010108',
      amount: 19,
      unit_of_measure: 'Each',
      created_at: new Date(),
    });
  }

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

    const basket = this.baskets[basketId];
    if (!basket) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    const response = await axios.get(
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product_detail_v2_${language}.json`,
    );
    const products = response.data;

    basket.products.forEach(async (value) => {
      const productOptional = products.find((i) => i.product.id === value.id);
      if (productOptional) {
        const product = productOptional.product;
        const productPrice =
          product.prices.find((i) => i.unit_of_measure === 'Each') ||
          product.prices[0];

        value.name = product.title;
        value.original_price = productPrice.original_price;
        value.discounted_price = productPrice.discounted_price;
        value.unit_price = productPrice.unit_price;
        value.unit_of_measure = productPrice.unit_of_measure;
        value.total_price = productPrice.unit_price * value.amount;
        value.image_url = product.resources[0].url;
      }

      value.min_amount = 0;
      value.max_amount = 10;
      const optional = this.getOptionalFields(value.id, language);
      if (optional) {
        value.optional = [];
        value.optional.push(optional);
      }
    });
    basket.summary = new BasketSummary(basket.products, language);
    return basket;
  }

  async updateById(
    basketId: string,
    language: string,
    basketUpdateDto: BasketUpdateDto,
  ): Promise<BasketsResponse> {
    const basket = this.baskets[basketId];
    if (typeof basket === 'undefined') {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    basket.products = basket.products.filter((value) =>
      basketUpdateDto.products.map((i) => i.id).includes(value.id),
    );

    basket.products.forEach((value) => {
      const dto = basketUpdateDto.products.find((i) => i.id === value.id);
      value.amount = dto.amount;
    });

    basket.products = basket.products.filter((value) => value.amount > 0);
    return await this.getById(basketId, language);
  }

  async updateBasketProduct(
    basketId: string,
    language: string,
    updateBasketProductDto: ProductBasketUpdateDto,
  ) {
    const basket = this.baskets[basketId];
    if (typeof basket === 'undefined') {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    const basketProduct = basket.products.find(
      (i) => i.id === updateBasketProductDto.id,
    );
    if (basketProduct) {
      basketProduct.amount = updateBasketProductDto.amount;
    } else {
      const newBasketProduct = new BasketProduct();
      newBasketProduct.id = updateBasketProductDto.id;
      newBasketProduct.amount = updateBasketProductDto.amount;
      basket.products.push(newBasketProduct);
    }
    basket.products = basket.products.filter((value) => value.amount > 0);
    return await this.getById(basketId, language);
  }

  getOptionalFields(productId: string, language: string): any {
    let missedPromotionText =
      'Missed promotion ! This product was ฿39.00 until 23 Dec. 2020';
    let removeSomeItemText = 'or remove some of this item to check out';
    if (language == 'th') {
      missedPromotionText =
        'พลาดโปรโมชั่น! สินค้าชิ้นนี้เคยราคา 39 บาท จนถึง 23 ธันวาคม 2563';
      removeSomeItemText = 'ลบสินค้าบางอย่างออก แล้วเช็คเอาท์';
    }

    if (+productId % 4 === 0) {
      return { missed_promotion_text: missedPromotionText };
    } else if (+productId % 3 === 0) {
      return { remove_some_item_text: removeSomeItemText };
    } else if (+productId % 2 === 0) {
      return {
        missed_promotion_text: missedPromotionText,
        remove_some_item_text: removeSomeItemText,
      };
    } else {
      return null;
    }
  }
}
