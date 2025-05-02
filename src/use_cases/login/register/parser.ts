/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes/BaseParser";
import { employeeValidator } from "../../EmployeeValidator";

export class RegisterOwnerWithEmailParser extends BaseParser {
  constructor(data: any) {
    super();
    this.parseEmail(data.email);
    this.parsePassword(data.password);
  }

  parseEmail(value: any): void {
    const result = employeeValidator.validateEmail(value);

    this.pushIfError(result);
  }

  parsePassword(value: any): void {
    const result = employeeValidator.validatePassword(value);
    this.pushIfError(result);
  }
}
