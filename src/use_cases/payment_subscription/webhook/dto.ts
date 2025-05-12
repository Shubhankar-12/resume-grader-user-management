import { IWebhookPaymentSubscriptionRequest } from "./request";

export interface IWebhookPaymentSubscriptionDto {
  event: string;
  payload: any;
}

export class WebhookPaymentSubscriptionDtoConverter {
  private output_object: IWebhookPaymentSubscriptionDto;
  constructor(data: IWebhookPaymentSubscriptionRequest) {
    this.output_object = {
      event: data.event,
      payload: data.payload,
    };
  }
  public getDtoObject(): IWebhookPaymentSubscriptionDto {
    return this.output_object;
  }
}
