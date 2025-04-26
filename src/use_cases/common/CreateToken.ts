import jsonwebtoken from "jsonwebtoken";
import { Token } from "../../interfaces";
import { v4 as uuid } from "uuid";

export function createToken(token_details: Token): string {
  if (process.env.ADMIN_POLICY_JWT_KEY === undefined) {
    throw new Error("ADMIN_POLICY_JWT_KEY is missing from process env");
  }
  // adding uuid for uniqueness
  const tokenObj = {
    ...token_details,
    uuid: uuid(),
  };
  // create new login token
  const token = jsonwebtoken.sign(tokenObj, process.env.ADMIN_POLICY_JWT_KEY);
  return token;
}
