import { Server } from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context } from 'aws-lambda';
import * as serverlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { BaseExceptionFilter } from './filters/base-exception.filter';
import { UnexpectedErrorFilter } from './filters/unexpected-error.filter';
import { ValidationPipe } from '@nestjs/common';

let lambdaProxy: Server;

async function bootstrap() {
  const expressServer = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressServer),
    {
      cors: true,
    },
  );
  const options = new DocumentBuilder()
    .setTitle('Mock Shopping Online API 555')
    .setVersion('1.0')
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(nestApp, options);
  SwaggerModule.setup('swagger-ui', nestApp, document);

  nestApp.useGlobalFilters(
    new UnexpectedErrorFilter(),
    new HttpExceptionFilter(),
    new BaseExceptionFilter(),
  );
  nestApp.useGlobalPipes(new ValidationPipe());
  await nestApp.init();

  return serverlessExpress.createServer(expressServer);
}

export const handler = (event: any, context: Context) => {
  if (!lambdaProxy) {
    bootstrap().then((server) => {
      lambdaProxy = server;
      serverlessExpress.proxy(lambdaProxy, event, context);
    });
  } else {
    serverlessExpress.proxy(lambdaProxy, event, context);
  }
};
