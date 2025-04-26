import { requestAuthenticator } from "../common_middleware";
import { requestLoggedInAuthenticator } from "../common_middleware/logged_in";
import { POLICIES } from "../common_middleware/policies";
import { MiddleWareFunctionType } from "../helpers";

export class BaseMiddleware {
  ensureAuthentication(policies: POLICIES[]): MiddleWareFunctionType {
    return requestAuthenticator.authenticate(policies);
  }
  ensureLoggedIn(): MiddleWareFunctionType {
    return requestLoggedInAuthenticator.execute();
  }
}
