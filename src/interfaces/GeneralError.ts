import { IError } from '.';

export abstract class GeneralError implements IError {
  public readonly message: string;
  public readonly code: string;
  public readonly field: string;

  constructor(code: string, message: string, field: string) {
    this.code = code;
    this.message = message;
    this.field = field;
  }
}
