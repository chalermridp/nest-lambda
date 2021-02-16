import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './filters/base-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UnexpectedErrorFilter } from './filters/unexpected-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Mock Shopping Online API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui', app, document);

  app.useGlobalFilters(
    new UnexpectedErrorFilter(),
    new HttpExceptionFilter(),
    new BaseExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
