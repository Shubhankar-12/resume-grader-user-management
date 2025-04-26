/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Structure defined to log for response from api.
 */
interface ResponseLog {
  req_id: unknown;
  res: { locals: any };
}

export { ResponseLog };
