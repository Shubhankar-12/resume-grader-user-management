import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { WebhookPaymentSubscriptionUseCase } from "./usecase";
import { WebhookPaymentSubscriptionDtoConverter } from "./dto";
import { IWebhookPaymentSubscriptionRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class WebhookPaymentSubscriptionController extends BaseController {
  private webhookPaymentSubscriptionUseCase: WebhookPaymentSubscriptionUseCase;

  constructor(
    webhookPaymentSubscriptionUseCase: WebhookPaymentSubscriptionUseCase
  ) {
    super();
    this.webhookPaymentSubscriptionUseCase = webhookPaymentSubscriptionUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: IWebhookPaymentSubscriptionRequest = req.body;
    const dtoObj = new WebhookPaymentSubscriptionDtoConverter(data);
    const result = await this.webhookPaymentSubscriptionUseCase.execute({
      request: dtoObj.getDtoObject(),
      headers: req.headers,
    });
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: "error" }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: "Invalid Request",
        statusCode: 400,
      });
    } else {
      res.locals.response = this.created(result.value);
    }
    return;
  }
}

export { WebhookPaymentSubscriptionController };
