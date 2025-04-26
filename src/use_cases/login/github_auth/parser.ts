/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from "../../../base_classes/BaseParser";
import { employeeValidator } from "../../EmployeeValidator";

export class GitHubAuthParser extends BaseParser {
  constructor(data: any) {
    super();
    this.parseString(data.code);
    data.state && this.parseString(data.state);
  }

  parseString(value: any): void {
    const result = employeeValidator.validateString(value, "code");

    this.pushIfError(result);
  }
}
