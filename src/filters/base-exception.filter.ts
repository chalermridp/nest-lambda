import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from 'src/exceptions/base.exception';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.code).json({
      code: exception.code,
      error_name: exception.errorName,
      error_message: exception.errorMessage,
    });
  }
}
