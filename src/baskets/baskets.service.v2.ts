import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { S3FileHelper } from 'src/common/utilities/s3-file-helper';
import { BasketNotFoundException } from 'src/exceptions/basket-not-found.exception';
import { BasketUpdateDto } from './dto/baskets.update.dto';
import { BookingSlotBasketUpdateDto } from './dto/booking-slot-basket.update.dto';
import { ProductBasketUpdateDto } from './dto/product-baskets.update.dto';
import { BasketBookingSlot } from './responses/baskets.booking-slot';
import { BasketProduct } from './responses/baskets.product';
import { BasketsResponse } from './responses/baskets.response';
import { BasketSummary } from './responses/baskets.summary';

@Injectable()
export class BasketsServiceV2 {
  constructor(private s3FileHelper: S3FileHelper) {}

  private BUCKET_NAME = 'oh-shopping-online';
  private BASKET_FOLDER_NAME = 'basket';

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

    const basketInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
    );
    if (!basketInS3) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }
    const basket: BasketsResponse = JSON.parse(basketInS3);

    const response = await axios.get(
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product_detail_v2_${language}.json`,
    );
    const products = response.data;

    basket.products.forEach(async (basketProduct) => {
      const productOptional = products.find(
        (p) => p.product.id === basketProduct.id,
      );
      if (productOptional) {
        const product = productOptional.product;
        const productPrice =
          product.prices.find(
            (p) => p.unit_of_measure === basketProduct.unit_of_measure,
          ) || product.prices[0];

        basketProduct.name = product.title;
        basketProduct.original_price = productPrice.original_price;
        basketProduct.discounted_price = productPrice.discounted_price;
        basketProduct.unit_price = productPrice.unit_price;
        basketProduct.unit_of_measure = productPrice.unit_of_measure;
        if (
          productPrice.unit_of_measure === 'Kg' &&
          product.catch_weight_list
        ) {
          basketProduct.catch_weight_list = product.catch_weight_list;
        }
        basketProduct.total_price =
          productPrice.unit_price * basketProduct.amount;
        basketProduct.image_url = product.resources[0].url;
      }

      basketProduct.min_amount = 0;
      basketProduct.max_amount = 10;
      const optional = this.getOptionalFields(basketProduct.id, language);
      if (optional) {
        basketProduct.optional = [];
        basketProduct.optional.push(optional);
      }
    });
    basket.products = basket.products.sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date().getTime(),
    );
    basket.summary = new BasketSummary(basket.products, language);
    return basket;
  }

  async updateById(
    basketId: string,
    language: string,
    basketUpdateDto: BasketUpdateDto,
  ) {
    if (typeof language === 'undefined') {
      language = 'en';
    }
    if (language !== 'en' && language !== 'th') {
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "language must be \'en\' or \'th\'" }',
        400,
      );
    }

    const basketInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
    );
    if (!basketInS3) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }
    const basket: BasketsResponse = JSON.parse(basketInS3);

    const basketProducts = [];
    basketUpdateDto.products.forEach((dto) => {
      const unitOfMeasure =
        typeof dto.unit_of_measure !== 'undefined'
          ? dto.unit_of_measure
          : 'Each';

      const basketProduct = new BasketProduct();
      basketProduct.id = dto.id;
      basketProduct.amount = dto.amount;
      basketProduct.unit_of_measure = unitOfMeasure;
      if (!basketProduct.created_at) {
        basketProduct.created_at = new Date();
        if (dto.created_at) {
          basketProduct.created_at = dto.created_at;
        }
      }
      basketProducts.push(basketProduct);
    });
    basket.products = basketProducts.filter((value) => value.amount > 0);

    const content = JSON.stringify(basket);
    await this.s3FileHelper.uploadPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
      Buffer.from(content, 'utf8'),
    );

    return await this.getById(basketId, language);
  }

  async updateBasketProduct(
    basketId: string,
    language: string,
    updateBasketProductDto: ProductBasketUpdateDto,
  ) {
    if (typeof language === 'undefined') {
      language = 'en';
    }
    if (language !== 'en' && language !== 'th') {
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "language must be \'en\' or \'th\'" }',
        400,
      );
    }

    const basketInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
    );
    if (!basketInS3) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    const basket: BasketsResponse = JSON.parse(basketInS3);

    const basketProduct = basket.products.find(
      (i) => i.id === updateBasketProductDto.id,
    );
    const unitOfMeasure =
      typeof updateBasketProductDto.unit_of_measure !== 'undefined'
        ? updateBasketProductDto.unit_of_measure
        : 'Each';
    if (basketProduct) {
      basketProduct.amount = updateBasketProductDto.amount;
      basketProduct.unit_of_measure = unitOfMeasure;
    } else {
      const newBasketProduct = new BasketProduct();
      newBasketProduct.id = updateBasketProductDto.id;
      newBasketProduct.amount = updateBasketProductDto.amount;
      newBasketProduct.unit_of_measure = unitOfMeasure;
      newBasketProduct.created_at = new Date();
      if (updateBasketProductDto.created_at) {
        newBasketProduct.created_at = updateBasketProductDto.created_at;
      }
      basket.products.push(newBasketProduct);
    }
    basket.products = basket.products.filter((value) => value.amount > 0);

    const content = JSON.stringify(basket);
    await this.s3FileHelper.uploadPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
      Buffer.from(content, 'utf8'),
    );

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

  async updateBasketBookingSlot(
    basketId: string,
    updateBasketBookingSlotDto: BookingSlotBasketUpdateDto,
  ): Promise<BasketBookingSlot> {
    if (
      isNaN(updateBasketBookingSlotDto.expire_in_minute) ||
      updateBasketBookingSlotDto.expire_in_minute < 0
    ) {
      throw new BadRequestException(
        'expire_in_minute must be equal or more than 0',
        'invalid_params',
      );
    }
    const basketInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
    );
    if (!basketInS3) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    const basket: BasketsResponse = JSON.parse(basketInS3);

    const expireDateTime = new Date();
    expireDateTime.setMinutes(
      expireDateTime.getMinutes() + updateBasketBookingSlotDto.expire_in_minute,
    );
    basket.booking_slot.expire_datetime = expireDateTime;
    const content = JSON.stringify(basket);
    await this.s3FileHelper.uploadPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
      Buffer.from(content, 'utf8'),
    );
    return new BasketBookingSlot(expireDateTime);
  }

  async deleteBasketBookingSlot(basketId: string): Promise<BasketBookingSlot> {
    const basketInS3 = await this.s3FileHelper.getPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
    );
    if (!basketInS3) {
      throw new BasketNotFoundException(
        'basket_not_found',
        'basket does not exist',
      );
    }

    const basket: BasketsResponse = JSON.parse(basketInS3);
    basket.booking_slot.expire_datetime = null;
    const content = JSON.stringify(basket);
    await this.s3FileHelper.uploadPublicFile(
      this.BUCKET_NAME,
      `${this.BASKET_FOLDER_NAME}/${basketId}.json`,
      Buffer.from(content, 'utf8'),
    );
    return new BasketBookingSlot(null);
  }
}
