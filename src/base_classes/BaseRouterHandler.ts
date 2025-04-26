import {
  generalHook, MiddleWareFunctionType, responses,
} from '../helpers';
import { Router } from 'express';

class BaseRouterHandler {
  /**
   * Handles the passed middlewares by inserting a general pre hook
   * at the very beginning and general post hook and the very end.
   * @param {Router} router
   * @param {string} method
   * @param {string} path
   * @param {Array<MiddleWareFunctionType>} args
   */
  public handleWithHooks(
      router: Router,
      method: string,
      path: string,
      ...args: Array<MiddleWareFunctionType>
  ): void {
    router[method](
        path,
        generalHook.preHook(),
        ...args,
        generalHook.postHook(),
        responses.sendResponseMiddleware()
    );
  }
  /**
   * Handles the passed middlewares.
   * Expects a pre hook and post hook to be based by the programmer.
   * @param {Router} router
   * @param {string} method
   * @param {string} path
   * @param {Array<MiddleWareFunctionType>} args
   */
  public handle(
      router: Router,
      method: string,
      path: string,
      ...args: Array<MiddleWareFunctionType>
  ): void {
    router[method](path, ...args, responses.sendResponseMiddleware());
  }
}

export { BaseRouterHandler };
