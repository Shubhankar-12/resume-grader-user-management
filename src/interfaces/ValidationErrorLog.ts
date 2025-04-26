import { IError } from './Error';

/**
 * Structure defined to log for response having validation error
 */
interface ValidationErrorLog {
  req_id: string,
  errors: IError[],
}

export { ValidationErrorLog };
