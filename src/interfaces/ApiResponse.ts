/* eslint-disable @typescript-eslint/no-explicit-any */
import { IError } from "./index";

export interface IApiMetaResponse {
  total_documents: number;
  message: string;
  error?: string;
  pagination?: {
    current_page: number;
    next_page: number;
    previous_page: number;
    limit: number;
  };
  data_type?: string;
  languages?: string;
}

export interface IResponseParams {
  body: any;
  statusCode: number;
  meta: IApiMetaResponse;
  isSuccess: boolean;
  errors: Array<IError> | null;
}
