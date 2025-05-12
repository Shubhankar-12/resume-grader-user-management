import { BaseController } from "../../../base_classes";
import { Request, Response } from "express";
import { CreatePaymentSubscriptionUseCase } from "./usecase";
import { CreatePaymentSubscriptionDtoConverter } from "./dto";
import { ICreatePaymentSubscriptionRequest } from "./request";
import { logUseCaseError } from "../../../logger";

class CreatePaymentSubscriptionController extends BaseController {
  private createPaymentSubscriptionUseCase: CreatePaymentSubscriptionUseCase;

  constructor(
    createPaymentSubscriptionUseCase: CreatePaymentSubscriptionUseCase
  ) {
    super();
    this.createPaymentSubscriptionUseCase = createPaymentSubscriptionUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const data: ICreatePaymentSubscriptionRequest = req.body;
    const dtoObj = new CreatePaymentSubscriptionDtoConverter(data);
    const result = await this.createPaymentSubscriptionUseCase.execute({
      request: dtoObj.getDtoObject(),
      auth: res.locals.auth,
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

export { CreatePaymentSubscriptionController };
