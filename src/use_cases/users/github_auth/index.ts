import { GithubUpdateMiddleware } from "./middleware";
import { GithubUpdateUseCase } from "./usecase";
import { GithubUpdateController } from "./controller";

const githubUpdateUseCase = new GithubUpdateUseCase();
export const githubUpdateController = new GithubUpdateController(
  githubUpdateUseCase
);
export const githubUpdateMiddleware = new GithubUpdateMiddleware();
