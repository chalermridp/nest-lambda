import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProductNotFoundException } from 'src/exceptions/product-not-found.exception';
import { ProductFilterDto } from './dto/products.filter.dto';
import { ProductFilterDtoV2 } from './dto/products.filter.dto.v2';
import { ProductsGetByIdsDto } from './dto/products.get-by-ids.dto';
import { Product } from './products.model';
import { ProductV2 } from './products.model.v2';
import { ProductDetailsByIdsResponseV2 } from './response/product-details-by-ids.response.v2';
import { ProductDetailsResponseV2 } from './response/product-details.reponse.v2';
import { ProductDetailsResponse } from './response/product-details.response';
import { ProductsResponse } from './response/products.response';
import { ProductsResponseV2 } from './response/products.response.v2';

@Injectable()
export class ProductsService {
  
  async getAll(): Promise<Product[]> {
    const response = await axios.get(
      'https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product.json',
    );
    const products = response.data.map((value) => {
      return value;
    });
    return products;
  }

  async getAllV2(language: string): Promise<Product[]> {
    const response = await axios.get(
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product_detail_v2_${language}.json`,
    );
    const products = response.data.map((value) => {
      return value;
    });
    return products;
  }

  async getFiltered(filterDto: ProductFilterDto): Promise<ProductsResponse> {
    let products = await this.getAll();
    if (typeof filterDto.keyword !== 'undefined') {
      products = products.filter((p) =>
        p.productNameEN
          .concat(p.productNameTH)
          .toLocaleLowerCase()
          .includes(filterDto.keyword.toLocaleLowerCase()),
      );
    }
    if (typeof filterDto.categoryLevel1 !== 'undefined') {
      products = products.filter(
        (p) => p.categoryLevel1 === filterDto.categoryLevel1,
      );
    }
    if (typeof filterDto.categoryLevel2 !== 'undefined') {
      products = products.filter(
        (p) => p.categoryLevel2 === filterDto.categoryLevel2,
      );
    }
    if (typeof filterDto.categoryLevel3 !== 'undefined') {
      products = products.filter(
        (p) => p.categoryLevel3 === filterDto.categoryLevel3,
      );
    }

    let { limit, offset } = filterDto;
    if (typeof limit === 'undefined') {
      limit = 100;
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    const total = products.length;
    offset = +offset;
    limit = +limit;
    products = products.slice(offset, offset + limit);

    const data = new ProductsResponse();
    data.total = total;
    data.offset = offset;
    data.limit = limit;
    data.items = products;
    return data;
  }

  async getFilteredV2(filterDto: ProductFilterDtoV2, language: string): Promise<ProductsResponse> {
    if (typeof language === 'undefined') {
      language = 'en';
    }
    if (language !== 'en' && language !== 'th') {
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "language must be \'en\' or \'th\'" }',
        400,
      );
    }

    let products = await this.getAllV2(language);
    if (typeof filterDto.ids !== 'undefined') {
      const ids = filterDto.ids.split(',');
      console.log(ids);
      console.log(products.length)
      products = products.filter(i => ids.includes(i.productId));
    }
    console.log(products.length)


    let { limit, offset } = filterDto;
    if (typeof limit === 'undefined') {
      limit = 100;
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    const total = products.length;
    offset = +offset;
    limit = +limit;
    products = products.slice(offset, offset + limit);

    const data = new ProductsResponse();
    data.total = total;
    data.offset = offset;
    data.limit = limit;
    data.items = products;
    return data;
  }

  async getById(
    productId: string,
    language: string,
  ): Promise<ProductDetailsResponse> {
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
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product_detail_${language}.json`,
    );
    const products: ProductDetailsResponse[] = response.data
      .filter((i) => i.product.id === productId)
      .map((value) => {
        return value;
      });

    if (products.length === 0) {
      throw new ProductNotFoundException(
        'product_not_found',
        'product does not exist',
      );
    }

    return products[0];
  }

  async getByIdV2(
    productId: string,
    language: string,
  ): Promise<ProductDetailsResponseV2> {
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
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product_detail_v2_${language}.json`,
    );
    const products: ProductDetailsResponseV2[] = response.data
      .filter((i) => i.product.id === productId)
      .map((value) => {
        return value;
      });

    if (products.length === 0) {
      throw new ProductNotFoundException(
        'product_not_found',
        'product does not exist',
      );
    }

    return products[0];
  }

  async getByIdsV2(getByIdsDto: ProductsGetByIdsDto, language: string) : Promise<ProductDetailsByIdsResponseV2> {
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
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/product_detail_v2_${language}.json`,
    );

    const products: ProductDetailsByIdsResponseV2 = response.data.filter(i => getByIdsDto.product_ids.includes(i.product.id) );

    return products;
  }
}
