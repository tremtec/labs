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
    const authToken = cookies.getAuthToken(req);
    if (!authToken) return raise("No session found");
    return await this.fetchUserData(authToken);
  }

  async persistAuthToken(code: string, req: Request) {
    const accessToken = await this.fetchAuthToken(code);
    return cookies.setAuthToken(req, accessToken);
  }

  async refreshAuthToken(req: Request) {
    const authToken = cookies.getAuthToken(req);
    if (!authToken) return null;

    logger.debug("token exists");

    const isTokenExpired = await this.isTokenExpired(authToken);
    if (!isTokenExpired) return null;

    logger.debug("token expired");

    const newAuthToken = await this.refreshExpiredToken(authToken.refreshToken);
    return cookies.setAuthToken(req, newAuthToken);
  }

  async isTokenExpired({ accessToken }: AuthToken) {
    const ping = await fetch(API_URL + "/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    return !ping.ok;
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

  private async fetchUserData(
    { accessToken }: AuthToken,
  ): Promise<UserProfile> {
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
    const accessToken = data["access_token"];
    const refreshToken = data["refresh_token"];

    logger.debug({
      info: "parsing auth token from json",
      accessToken,
      refreshToken,
      data,
    });
    return AuthTokenSchema.parse({ accessToken, refreshToken });
  }
}

class AuthCookies {
  getAuthToken(req: Request) {
    // Get cookie from request header and parse it
    const value = getCookies(req.headers)[github.cookieAuthKey] ?? "";
    if (value.trim() === "") return null;

    const [accessToken = "", refreshToken = ""] = value.split(":");
    return AuthTokenSchema.parse({ accessToken, refreshToken });
  }

  setAuthToken(req: Request, accessToken: AuthToken) {
    const url = new URL(req.url);
    const cookie: Cookie = {
      name: github.cookieAuthKey,
      value: `${accessToken.accessToken}:${accessToken.refreshToken}`,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "Lax", // this is important to prevent CSRF attacks
      domain: url.hostname,
      path: "/",
      secure: url.href.startsWith("https"),
    };

    const headers = new Headers({ location: url.origin });
    setCookie(headers, cookie);

    return headers;
  }

  deleteAuthToken(req: Request) {
    const url = new URL(req.url);
    const headers = new Headers(req.headers);

    deleteCookie(headers, github.cookieAuthKey, {
      path: "/",
      domain: url.hostname,
    });

    return headers;
  }
}

type AuthToken = z.infer<typeof AuthTokenSchema>;

const AuthTokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const GithubApiErrorSchema = z.object({
  message: z.string(),
});

export const cookies = new AuthCookies();
export const client = new GitHubClient();
