import { BaseController } from '../../../base_classes';
import {
  Request, Response,
} from 'express';
import { ListApplicationsUseCase } from './usecase';
import { ListApplicationsDtoConverter } from './dto';
import { IListApplicationsQueryParam } from './request';
import { logUseCaseError } from '../../../logger';

class ListApplicationsController extends BaseController {
  private listApplicationsUseCase: ListApplicationsUseCase;

  constructor(listApplicationsUseCase: ListApplicationsUseCase) {
    super();
    this.listApplicationsUseCase = listApplicationsUseCase;
  }

  async executeImpl(req: Request, res: Response): Promise<void> {
    const queryParams: IListApplicationsQueryParam =
      req.query as unknown as IListApplicationsQueryParam;
    const dtoObj = new ListApplicationsDtoConverter(queryParams);
    const result = await this.listApplicationsUseCase.execute(
        dtoObj.getDtoObject()
    );
    if (result.isErrClass()) {
      logUseCaseError([result.value], { level: 'error' }, res);
      res.locals.response = this.fail({
        errors: result.value,
        message: 'Invalid Request',
        statusCode: 400,
      });
    } else {
      res.locals.response = this.success(result.value);
    }
    return;
  }
}

export { ListApplicationsController };
