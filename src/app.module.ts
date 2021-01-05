import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [HomeModule, CategoriesModule, ProductsModule],
})
export class AppModule {}
