import { Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter';

@Catch()
export class UnexpectedErrorFilter implements HttpExceptionFilter {
  // catch(exception: unknown, host: ArgumentsHost) {
  //   super.catch(exception, host);
  // }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json({
      code: 500,
      error_name: 'internal_server_error',
      error_message: 'an unexpected error has occurred',
    });
  }
}
