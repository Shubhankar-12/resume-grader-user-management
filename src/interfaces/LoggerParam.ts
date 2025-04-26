export interface LoggerParam {
  /**
   * @property {string} level
   * indicates whether we want to log as warning or error or information.
   * e.g. "warn","info","error"
   */
  level: string;
  /**
   * @property {boolean} critical
   * indicates if the logger is attached to function containing critical
   * information. e.g. passwords etc.
   */
  critical?: boolean;
}
