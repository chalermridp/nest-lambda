import { BaseException } from './base.exception';

export class InvalidParamsException extends BaseException {
  constructor(errorMessage: string) {
    super(400, 'invalid_params', errorMessage);
  }
}
