export class BaseException {
  code: number;
  errorName: string;
  errorMessage: string;

  constructor(code: number, errorName: string, errorMessage: string) {
    this.code = code;
    this.errorName = errorName;
    this.errorMessage = errorMessage;
  }
}
