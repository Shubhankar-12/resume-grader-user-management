import { Request, Response } from 'express';
import { parseGetAnalyticsRequest } from './parser';
import { validateGetAnalyticsRequest } from './validator';
import { GetAnalyticsUseCase } from './usecase';

export class GetAnalyticsController {
  private useCase: GetAnalyticsUseCase;

  constructor(useCase?: GetAnalyticsUseCase) {
    this.useCase = useCase ?? new GetAnalyticsUseCase();
  }

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const parsed = parseGetAnalyticsRequest(req);

      const validationError = validateGetAnalyticsRequest(parsed);
      if (validationError) {
        res.status(400).json({
          isSuccess: false,
          statusCode: 400,
          errors: [{ message: validationError }],
          body: null,
        });
        return;
      }

      const result = await this.useCase.execute(parsed);

      res.status(200).json({
        isSuccess: true,
        statusCode: 200,
        errors: null,
        body: result,
      });
    } catch (err) {
      console.error('[GetAnalyticsController] Unexpected error:', err);
      res.status(500).json({
        isSuccess: false,
        statusCode: 500,
        errors: [{ message: 'An unexpected error occurred' }],
        body: null,
      });
    }
  }
}
