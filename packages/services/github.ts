import { z } from "zod";
import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "$std/http/cookie.ts";
import { github } from "#/settings.ts";
import { UserProfile, UserProfileSchema } from "#/entities/userProfile.ts";
import { raise } from "~/shared/exceptions.ts";
import { logger } from "~/shared/logging.ts";

const AUTH_URL = "https://github.com/login/oauth";
const API_URL = "https://api.github.com";

class GitHubClient {
  private headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  createLink(req: Request) {
    const url = new URL(req.url);
    const redirectUrl = new URL(AUTH_URL + "/authorize");
    const state: number = Math.floor(Math.random() * 1000000000);

    const params = {
      response_type: "code",
      scope: github.scope,
      state: state.toString(),
      client_id: github.clientId,
      redirect_uri: url.origin + github.callbackUrl,
    };

    logger.debug({ info: "creating redirect link", params });

    for (const [key, value] of Object.entries(params)) {
      redirectUrl.searchParams.append(key, value);
    }

    return redirectUrl.toString();
  }

  async fetchAuthenticatedUser(req: Request): Promise<UserProfile> {
    // Get cookie from request header and parse it
    const accessToken = cookies.getAccessToken(req);
    if (!accessToken) return raise("No session found");
    return await this.fetchUserData(accessToken);
  }

  async persistAuthToken(code: string, req: Request) {
    const authToken = await this.fetchAuthToken(code);
    return cookies.setAuthToken(req, authToken);
  }

  async refreshAuthToken(req: Request) {
    const refreshToken = cookies.getRefreshToken(req);
    if (!refreshToken) {
      logger.error({ info: "no refresh token found" });
      return null;
    }

    try {
      const newAuthToken = await this.refreshExpiredToken(refreshToken);
      return cookies.setAuthToken(req, newAuthToken);
    } catch (error) {
      logger.error({ info: "failed to refresh token", error });
      return null;
    }
  }

  private async fetchAuthToken(code: string) {
    const params = {
      code,
      client_id: github.clientId,
      client_secret: github.clientSecret,
    };

    logger.debug({ info: "fetch token", params });

    const response = await fetch(
      AUTH_URL + "/access_token",
      {
        method: "POST",
        body: JSON.stringify(params),
        headers: this.headers,
      },
    );

    if (!response.ok) {
      raise(await response.text());
    }

    const data = await response.json();
    const authToken = this.parseAuthToken(data);

    logger.debug({ authToken, data });
    return authToken;
  }

  private async fetchUserData(accessToken: string): Promise<UserProfile> {
    const response = await fetch(API_URL + "/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    if (!response.ok) {
      const json = await response.json() ?? raise("unkdown error");
      const { message } = GithubApiErrorSchema.parse(json);
      logger.error(json, message);

      raise(message);
    }

    const userData = await response.json();
    logger.debug({ userData });

    return UserProfileSchema.parse({
      id: userData.id as number,
      name: userData.name ?? userData.login as string,
      username: userData.login as string,
      avatarUrl: userData["avatar_url"] as string,
      bio: userData["bio"] as string,
    });
  }

  private async refreshExpiredToken(refreshToken: string) {
    const params = {
      client_id: github.clientId,
      client_secret: github.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    logger.debug({ info: "refreshing token", params });

    const response = await fetch(AUTH_URL + "/access_token", {
      method: "POST",
      body: JSON.stringify(params),
      headers: this.headers,
    });

    const refreshResp = await response.json();
    return this.parseAuthToken(refreshResp);
  }

  private parseAuthToken(data: ReturnType<typeof JSON.parse>) {
    logger.debug({
      info: "parsing auth token from json",
      data,
    });
    return AuthTokenSchema.parse(data);
  }
}

class AuthCookies {
  getAccessToken(req: Request) {
    return getCookies(req.headers)["access_token"];
  }

  getRefreshToken(req: Request) {
    return getCookies(req.headers)["refresh_token"];
  }

  setAuthToken(req: Request, accessToken: AuthToken) {
    const url = new URL(req.url);
    const headers = new Headers({ location: url.origin });
    const tokens: [string, string, number][] = [
      ["access_token", accessToken.access_token, accessToken.expires_in],
      [
        "refresh_token",
        accessToken.refresh_token,
        accessToken.refresh_token_expires_in,
      ],
    ];

    for (const [name, token, expires_at] of tokens) {
      const cookie: Cookie = {
        name,
        value: token,
        maxAge: expires_at,
        httpOnly: true,
        sameSite: "Lax", // this is important to prevent CSRF attacks
        domain: url.hostname,
        path: "/",
        secure: url.href.startsWith("https"),
      };

      setCookie(headers, cookie);
    }

    return headers;
  }

  deleteAuthToken(req: Request) {
    const url = new URL(req.url);
    const headers = new Headers({ location: url.origin });

    ["access_token", "refresh_token"].map((key) => {
      deleteCookie(headers, key, {
        path: "/",
        domain: url.hostname,
      });
    });

    return headers;
  }
}

type AuthToken = z.infer<typeof AuthTokenSchema>;

const AuthTokenSchema = z.object({
  scope: z.string(),
  token_type: z.string(),
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  refresh_token_expires_in: z.number(),
});

const GithubApiErrorSchema = z.object({
  message: z.string(),
});

export const cookies = new AuthCookies();
export const client = new GitHubClient();
