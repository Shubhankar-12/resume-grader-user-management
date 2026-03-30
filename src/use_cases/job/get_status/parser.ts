/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseParser } from '../../../base_classes';
import { JobValidator } from '../JobValidator';

export class GetJobStatusParser extends BaseParser {
  private jobValidator: JobValidator;

  constructor(query: any, jobValidator: JobValidator) {
    super();
    this.jobValidator = jobValidator;
    this.parseJobId(query.job_id);
  }

  parseJobId(value: any): void {
    const result = this.jobValidator.validateId('job_id', value);
    this.pushIfError(result);
  }
}
