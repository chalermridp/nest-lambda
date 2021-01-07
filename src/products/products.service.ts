import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { HelloException } from 'src/exceptions/hello.exception';
import { ProductNotFoundException } from 'src/exceptions/product-not-found.exception';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ProductFilterDto } from './dto/products.filter.dto';
import { Product } from './products.model';
import { ProductDetailsResponse } from './response/product-details.response';

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

  async getFiltered(filterDto: ProductFilterDto): Promise<Product[]> {
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
    return products;
  }

  async getById(productId: string): Promise<ProductDetailsResponse> {
    const response = await axios.get(
      'https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/product/IGHS_Mock_product_detail.json',
    );
    const products = response.data
      .filter((i) => i.product.id === productId)
      .map((value) => {
        return value;
      });

    if (products.length === 0) {
      throw new HttpException(
        '{ "error_name": "product_not_found", "error_message": "product does not exist"}',
        404,
      );
      // throw new ProductNotFoundException(
      //   'product_not_found',
      //   'product does not exist',
      // );
    }

    const result = new ProductDetailsResponse();
    result.code = 200;
    result.message = 'success';
    result.data = products[0];
    return result;
  }
}
