import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const error = JSON.parse(JSON.stringify(exception.getResponse()));

    response.status(status).json({
      code: status,
      error_name: error.error_name,
      error_message: error.error_message,
    });
  }
}
