import { BaseException } from './base.exception';

export class AccountNotFoundException extends BaseException {
  constructor(errorName: string, errorMessage: string) {
    super(404, errorName, errorMessage);
  }
}
