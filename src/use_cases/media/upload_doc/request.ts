import { Types } from "mongoose";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUploadDocRequest {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  folder?: string;
}
