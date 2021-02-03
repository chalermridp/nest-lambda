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
    this.baskets["1"] = new BasketsResponse();
    this.baskets["1"].products = [];

    this.baskets["2"] = new BasketsResponse();
    this.baskets["2"].products = [];
    this.addProductToBasket("2", "en", { id: "99010101", amount: 3 });
    this.addProductToBasket("2", "en", { id: "99010102", amount: 7 });
    this.addProductToBasket("2", "en", { id: "99010103", amount: 4 });
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
    const productDetails = response.data;
    basket.products.forEach(value => {
      value.name = productDetails.find(i => i.product.id === value.id).product.title;
      const optional = this.getOptionalFields(value.id, language);
      if (optional) {
        value.optional = [];
        value.optional.push(optional);
      }
    })
    basket.summary = new BasketSummary(basket.products, language);
    return basket;
  }

  async updateById(basketId: string, language: string, basketUpdateDto: BasketUpdateDto): Promise<BasketsResponse> {
    const basket = this.baskets[basketId];
    if (typeof basket === 'undefined') {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    basket.products = basket.products.filter(value => basketUpdateDto.products.map(i => i.id).includes(value.id));
    basket.products.forEach(value => {
      const updateDto = basketUpdateDto.products.find(i => i.id === value.id);
      if (updateDto) {
        value.amount = updateDto.amount;
        value.total_price = value.unit_price * value.amount;
      }
    })
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

    const response = await this.productsService.getByIdV2(addProductToBasketDto.id, language);
    const product = response.product;
    const productPrice = response.product.prices.find(i => i.unit_of_measure === 'Each') || response.product.prices[0];

    let basketProduct = basket.products.find(i => i.id === addProductToBasketDto.id);
    if (basketProduct) {
      basketProduct.amount += addProductToBasketDto.amount;
    }
    else {
      basketProduct = new BasketProduct();
      basketProduct.amount = addProductToBasketDto.amount;
      basket.products.push(basketProduct);
    }

    basketProduct.name = product.title;
    basketProduct.id = product.id;
    basketProduct.original_price = productPrice.original_price;
    basketProduct.discounted_price = productPrice.discounted_price;
    basketProduct.unit_price = productPrice.unit_price;
    basketProduct.unit_of_measure = productPrice.unit_of_measure;
    basketProduct.total_price = productPrice.unit_price * basketProduct.amount;
    basketProduct.min_amount = 0;
    basketProduct.max_amount = 10;
    basketProduct.image_url = product.resources[0].url;
    const optional = this.getOptionalFields(basketProduct.id, language);
    if (optional) {
      basketProduct.optional = [];
      basketProduct.optional.push(optional)
    }
    return basketProduct;
  }


  getOptionalFields(productId: string, language: string): any {
    let missedPromotionText = "Missed promotion ! This product was ฿39.00 until 23 Dec. 2020";
    let removeSomeItemText = "or remove some of this item to check out";
    if (language == 'th') {
      missedPromotionText = 'พลาดโปรโมชั่น! สินค้าชิ้นนี้เคยราคา 39 บาท จนถึง 23 ธันวาคม 2563';
      removeSomeItemText = 'ลบสินค้าบางอย่างออก แล้วเช็คเอาท์'
    }

    if (+productId % 4 === 0) {
      return { missed_promotion_text: missedPromotionText };
    } else if (+productId % 3 === 0) {
      return { remove_some_item_text: removeSomeItemText };
    } else if (+productId % 2 === 0) {
      return {
        missed_promotion_text: missedPromotionText,
        remove_some_item_text: removeSomeItemText
      };
    } else {
      return null;
    }
  }

  mockBasketProducts() {
    const products = [];
    return products;
  }
}
