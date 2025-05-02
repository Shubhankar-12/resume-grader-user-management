import { RegisterUserWithEmailMiddleware } from "./middleware";
import { RegisterUserWithEmailUseCase } from "./usecase";
import { RegisterUserWithEmailController } from "./controller";

const registerUserWithEmailUseCase = new RegisterUserWithEmailUseCase();
export const registerUserWithEmailController =
  new RegisterUserWithEmailController(registerUserWithEmailUseCase);
export const registerUserWithEmailMiddleware =
  new RegisterUserWithEmailMiddleware();
