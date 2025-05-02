import { IRegisterUserRequest } from "./request";
import crypto from "crypto";
import { Algorithm } from "../../../helpers/constants/constant";

export interface IRegisterOwnerDto {
  name: string;

  email: string;
  password: string;
}

export class RegisterOwnerDtoConverter {
  private output_object: IRegisterOwnerDto;
  constructor(data: IRegisterUserRequest) {
    this.output_object = { ...data };
    // creating a hmac-sha256 hex based on the secret key in environment
    if (process.env.PASSWORD_SECRET_KEY === undefined) {
      throw new Error("PASSWORD_SECRET_KEY is missing from process env");
    }
    const hmac = crypto.createHmac(
      Algorithm.SHA256,
      process.env.PASSWORD_SECRET_KEY
    );
    hmac.update(this.output_object.password);
    this.output_object.password = hmac.digest("hex");
    console.log(this.output_object.password);
  }
  public getDtoObject(): IRegisterOwnerDto {
    return this.output_object;
  }
}
