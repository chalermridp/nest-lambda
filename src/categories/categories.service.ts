import { Injectable } from '@nestjs/common';
import { Category } from './categories.model';
import axios from 'axios';

@Injectable()
export class CategoriesService {
  private categories = [];

  async getAll(): Promise<Category[]> {
    const response = await axios.get(
      'https://oh-shopping-online.s3-ap-southeast-1.amazonaws.com/category/category.json',
    );
    this.categories = response.data.map((value) => {
      return value;
    });
    return this.categories;
  }
}
