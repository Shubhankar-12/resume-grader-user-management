/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export class BaseParser {
  private errors: any[];

  constructor() {
    this.errors = [];
  }

  getErrors(): Array<any> {
    return this.errors;
  }

  pushIfError(error: any) {
    if (error instanceof Array) {
      for (const err of error) {
        if (err.isErrClass()) this.errors.push(err.value);
      }
    } else {
      if (error.isErrClass()) this.errors.push(error.value);
    }
  }
}
