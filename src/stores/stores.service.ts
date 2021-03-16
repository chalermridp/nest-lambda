import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { StoresFilterDto } from './dto/stores.filter.dto';
import { StoresResponse } from './response/stores.response';

@Injectable()
export class StoresService {
  async getNearest(filterDto: StoresFilterDto): Promise<StoresResponse> {
    let { limit, offset, lang } = filterDto;
    if (typeof lang === 'undefined') {
      lang = 'en';
    }
    if (lang !== 'en' && lang !== 'th') {
      throw new HttpException(
        '{ "error_name": "invalid_params", "error_message": "language must be \'en\' or \'th\'" }',
        400,
      );
    }
    const response = await axios.get(
      `https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/stores/v1_stores_nearest_${lang}.json`,
    );
    let stores = response.data.map((value) => {
      return value;
    });

    if (typeof limit === 'undefined') {
      limit = 10;
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    const total = stores.length;
    offset = +offset;
    limit = +limit;
    stores = stores.slice(offset, offset + limit);
    const data = new StoresResponse();
    data.total = total;
    data.offset = offset;
    data.limit = limit;
    data.items = stores;
    return data;
  }
}
