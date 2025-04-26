import axios from "axios";
import { logUnexpectedUsecaseError } from "../../../logger";
import {
  UseCase,
  Either,
  errClass,
  successClass,
  UseCaseError,
} from "../../../interfaces";
import { loginQueries, userQueries } from "../../../db";
import { createToken } from "../../common/CreateToken";

interface IGithubAuthDto {
  code: string;
}

export class GithubAuthUseCase implements UseCase<IGithubAuthDto, any> {
  private clientId = process.env.GITHUB_CLIENT_ID!;
  private clientSecret = process.env.GITHUB_CLIENT_SECRET!;

  @logUnexpectedUsecaseError({ level: "error" })
  async execute(request: IGithubAuthDto): Promise<any> {
    const { code } = request;

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
        name: github.name || github.login,
        username: github.login,
        email: github.email ?? undefined, // fallback
        avatar: {
          name: "avatar",
          url: github.avatar_url,
          mimetype: "image/jpeg",
        },
        provider: "github",
        providerId: String(github.id),
        githubProfile: {
          id: String(github.id),
          username: github.login,
          profileUrl: github.html_url,
          reposUrl: github.repos_url,
        },
        status: "ENABLED",
      };

      const existingUser = await userQueries.getUserByGithubLogin(
        userData.username
      );
      let userId: string = "";

      if (existingUser.length > 0) {
        userId = existingUser[0]._id.toString();
      } else {
        const newUser = await userQueries.create(userData);
        userId = newUser._id.toString();
      }
      const loginData = await loginQueries.findLogin(userId);

      if (loginData.length > 0) {
        return successClass({ token: loginData[0] });
      } else {
        const login = {
          is_login: true,
          user: {
            id: userId,
            name: userData.name,
            provider: userData.provider,
            providerId: userData.providerId,
            username: userData.username,
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
      }
    } catch (err) {
      console.error("GitHub OAuth Error", err);
      return errClass("GitHub login failed");
    }
  }
}
