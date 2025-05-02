import { UseCaseError } from "../../../interfaces";

export class UserDoesNotExist extends UseCaseError {
  constructor(id: string) {
    super("UserDoesNotExist", "The user does not exist in the database", id);
  }
}

export class UserAlreadyConnected extends UseCaseError {
  constructor(username: string) {
    super(
      "UserAlreadyConnected",
      "The user is already connected with github",
      username
    );
  }
}
