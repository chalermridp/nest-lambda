import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, HomeModule, CategoriesModule, ProductsModule],
  controllers: [HealthController],
})
export class AppModule {}
