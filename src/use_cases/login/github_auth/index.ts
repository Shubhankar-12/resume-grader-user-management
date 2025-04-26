import { GithubAuthMiddleware } from "./middleware";
import { GithubAuthUseCase } from "./usecase";
import { GithubAuthController } from "./controller";

const githubAuthUseCase = new GithubAuthUseCase();
export const githubAuthController = new GithubAuthController(githubAuthUseCase);
export const githubAuthMiddleware = new GithubAuthMiddleware();
