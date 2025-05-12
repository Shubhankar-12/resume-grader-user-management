import { ICreatePaymentSubscriptionRequest } from "./request";

export interface ICreatePaymentSubscriptionDto {
  plan: string;
}

export class CreatePaymentSubscriptionDtoConverter {
  private output_object: ICreatePaymentSubscriptionDto;
  constructor(data: ICreatePaymentSubscriptionRequest) {
    this.output_object = {
      plan: data.plan,
    };
  }
  public getDtoObject(): ICreatePaymentSubscriptionDto {
    return this.output_object;
  }
}
