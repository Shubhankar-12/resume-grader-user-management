import { UseCaseError } from "../../../interfaces";

export class UserNotFoundError extends UseCaseError {
  constructor(field: string) {
    super("UserNotFoundError", "The User not found", field);
  }
}
