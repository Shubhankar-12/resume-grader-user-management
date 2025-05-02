import { UseCaseError } from "../../../interfaces";

export class UserAlreadyExists extends UseCaseError {
  constructor() {
    super("UserAlreadyExists", "The user with this email already exists", "");
  }
}

export class RoleDosentExists extends UseCaseError {
  constructor() {
    super("RoleDosentExists", "The role doesnt exixts for employee", "");
  }
}
