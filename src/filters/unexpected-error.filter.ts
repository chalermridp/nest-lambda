import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class UnexpectedErrorFilter extends BaseExceptionFilter {
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
