import {
  Request, Response,
} from 'express';
interface Hook {
  preHookLogger(req: Request, res: Response): void;
  preHook(req: Request, res: Response): void;
  postHook(req: Request, res: Response): void;
  postHookLogger(req: Request, res: Response): void;
}
export { Hook };
