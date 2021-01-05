import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [HomeModule, CategoriesModule],
})
export class AppModule {}
