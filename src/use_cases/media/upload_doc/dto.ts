import validator from "validator";
import { TextUtils } from "../../../helpers/utils";
import { IUploadDocRequest } from "./request";
import { Algorithm } from "../../../helpers";
import crypto from "crypto";

export type IUploadDocDto = IUploadDocRequest;

export class UploadDocDtoConverter {
  private output_object: IUploadDocDto;
  constructor(data: IUploadDocRequest) {
    this.output_object = data;
  }
  public getDtoObject(): IUploadDocDto {
    return this.output_object;
  }
}
