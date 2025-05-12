import { UseCaseError } from "../../../interfaces";

export class UserNotFoundError extends UseCaseError {
  constructor(id: string, field: string) {
    super("UserNotFoundError", `The user with id ${id} does not exist`, field);
  }
}

// REPORT ALREADY EXISTS
export class InternalServerError extends UseCaseError {
  constructor() {
    super(
      "InternalServerError",
      "An unexpected error occurred. Please try again later.",
      ""
    );
  }
}

// Invalid webhook signature
export class InvalidWebhookSignatureError extends UseCaseError {
  constructor() {
    super("InvalidWebhookSignatureError", "Invalid webhook signature", "");
  }
}
