/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Structure defined to log for request hit on api.
 */
interface RequestLog {
  headers: any;
  method: string;
  originalUrl: string;
  params: any;
  query: any;
  body: string;
}

export { RequestLog };
