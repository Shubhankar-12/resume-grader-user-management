import axios from "axios";
import { logUnexpectedUsecaseError } from "../../../logger";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
  ResponseLocalAuth,
} from "../../../interfaces";
import { loginQueries, userQueries } from "../../../db";
import { createToken } from "../../common/CreateToken";
import { UserAlreadyConnected } from "./errors";
import jwt from "jsonwebtoken";

interface IGithubUpdateDto {
  code: string;
}

interface IGithubUpdateRequest {
  request: IGithubUpdateDto;
  auth: ResponseLocalAuth;
}

export class GithubUpdateUseCase implements UseCase<IGithubUpdateRequest, any> {
  private clientId = process.env.GITHUB_CLIENT_ID!;
  private clientSecret = process.env.GITHUB_CLIENT_SECRET!;

  @logUnexpectedUsecaseError({ level: "error" })
  async execute({ request, auth }: IGithubUpdateRequest): Promise<any> {
    const { code } = request;
    const decoded_token: any = jwt.decode(auth.token);

    if (!decoded_token) return errClass("Invalid token");

    const userId = decoded_token?.user?.id;

    try {
      // 1. Exchange code for access token
      const tokenResponse = await axios.post(
        `https://github.com/login/oauth/access_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
        },
        { headers: { Accept: "application/json" } }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) return errClass("GitHub token exchange failed");

      // 2. Fetch GitHub profile
      const profileRes = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const github = profileRes.data;

      const userData = {
        // name: github.name || github.login,
        username: github.login,
        // email: github.email ?? undefined, // fallback
        avatar: {
          name: "avatar",
          url: github.avatar_url,
          mimetype: "image/jpeg",
        },
        provider: "github",
        providerId: String(github.id),
        githubProfile: {
          githubId: github.id,
          username: github.login,
          profileUrl: github.html_url,
          reposUrl: github.repos_url,
        },
        status: "ENABLED",
      };

      let newUser: any;

      const existingUser = await userQueries.getUserByGithubLogin(
        userData.username
      );

      if (existingUser.length > 0) {
        return errClass(new UserAlreadyConnected(existingUser[0].username));
      } else {
        newUser = await userQueries.updateUser({
          ...userData,
          user_id: userId,
        });
      }

      const newData = await userQueries.getUserById(userId);

      const login = {
        is_login: true,
        user: {
          id: userId,
          name: newData[0].name,
          provider: newData[0].provider,
          providerId: newData[0].providerId,
          username: newData[0].username,
        },
      };
      const newToken = createToken(login);
      const loginData = await loginQueries.createLogin({
        ...login,
        token: newToken,
        status: "ENABLED",
      });
      if (loginData) {
        return successClass({
          token: newToken,
          decoded_token: loginData,
        });
      } else {
        return errClass("Login failed");
      }
    } catch (err) {
      console.error("GitHub OAuth Error", err);
      return errClass("GitHub login failed");
    }
  }
}
