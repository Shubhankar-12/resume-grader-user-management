
import jsonwebtoken from 'jsonwebtoken';
import {
  ResponseLocalAuth, Token,
} from '../../interfaces';
import { RequestHeaders } from '../../interfaces/RequestHeaders';

/**
 * This class is responsible to convert the input auth toke in headers
 * to the token structure used by the project.
 * The Token structure/interface is described in the interface folder.
 */
export class AuthDtoConverter {
  private output_object: ResponseLocalAuth;
  constructor(data: RequestHeaders) {
    // expecting the auth as Bearer <Token> validated in auth layer
    const token = data.authorization.split(' ')[1];
    const decoded_token:Token =
      jsonwebtoken
          .decode(token) as unknown as Token;
    this.output_object = {
      token,
      decoded_token,
    };
  }
  public getDtoObject(): ResponseLocalAuth {
    return this.output_object;
  }
}
