import { IError } from './Error';

/**
 * Structure defined to log for response having use case error
 */
interface UseCaseErrorLog {
  req_id: string,
  errors: IError[],
}

export { UseCaseErrorLog };
