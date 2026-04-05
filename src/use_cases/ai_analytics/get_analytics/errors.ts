import { UseCaseError } from '../../../interfaces';

export class InvalidDateRange extends UseCaseError {
  constructor() {
    super('InvalidDateRange', 'Invalid date range: "from" must be before "to"', 'from');
  }
}

export class InvalidGroupBy extends UseCaseError {
  constructor() {
    super('InvalidGroupBy', 'groupBy must be one of: day, week, month', 'groupBy');
  }
}

export class InvalidDateFormat extends UseCaseError {
  constructor(field: string) {
    super('InvalidDateFormat', `Invalid date format for field "${field}"`, field);
  }
}
