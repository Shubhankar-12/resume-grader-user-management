import { UseCaseError } from "../../../interfaces";

export class InvalidEmailOrPassword extends UseCaseError {
  constructor() {
    super(
      "InvalidEmailOrPassword",
      "The email or password provided is invalid",
      ""
    );
  }
}

export class RoleDosentExists extends UseCaseError {
  constructor() {
    super("RoleDosentExists", "The role doesnt exixts for employee", "");
  }
}
