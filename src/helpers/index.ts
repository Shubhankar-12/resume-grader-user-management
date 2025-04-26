import { Request, Response, NextFunction } from "express";
import { GeneralHook } from "./GeneralHook";
import { baseLogger } from "../logger/BaseLogger";
import { Responses } from "./Responses";
const generalHook = new GeneralHook(baseLogger);

type MiddleWareFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
type MiddleWareErrorFunctionType = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
const responses = new Responses();

export * as GeneralErrors from "./GeneralErrors";
export * from "./GeneralErrors";
export {
  MiddleWareFunctionType,
  generalHook,
  responses,
  Responses,
  MiddleWareErrorFunctionType,
};

export * from "./constants/constant";
