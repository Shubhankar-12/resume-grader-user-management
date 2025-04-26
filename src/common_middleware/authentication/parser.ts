/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseParser } from '../../base_classes';
import { POLICIES } from '../policies';
import { AuthenticationValidator } from './validator';

export class AuthenticationParser extends BaseParser {
  private authenticationValidator: AuthenticationValidator;
  private policies: POLICIES[];

  constructor(data: any, userValidator: AuthenticationValidator, policies: POLICIES[]) {
    super();
    this.policies = policies;
    this.authenticationValidator = userValidator;
    this.parseAuthorization(data.authorization);
  }

  parseAuthorization(value: any): void {
    const result = this.authenticationValidator.validateAuthorization(value,
        this.policies);
    this.pushIfError(result);
  }
}
