import { github } from "#/settings.ts";
import { logger } from "~/shared/logging.ts";
import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "$std/http/cookie.ts";

export interface GitHubConfig {
  clientId: string;
  clientSecret: string;
  redirect: string;
  tokenUri: string;
  scope: "read:user";
}

export type Profile = {
  id: number;
  name: string;
  username: string;
  avatarUrl: string;
};

const config: GitHubConfig = {
  clientId: github.clientId,
  clientSecret: github.clientSecret,
  tokenUri: "https://github.com/login/oauth/access_token",
  redirect: "https://tremtec.deno.dev/api/auth/github/callback", // The redirect uri is added in the GitHub OAuth developer settings
  scope: "read:user",
};

export class GitHubClient {
  async getAccessToken(code: string) {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        body: JSON.stringify({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    const accessToken = data["access_token"];

    logger.debug({ accessToken, data });

    if (typeof accessToken !== "string") {
      console.log({ accessToken });
      throw new Error("Access token was not a string.");
    }
    return accessToken;
  }

  async getUserData(accessToken: string): Promise<Profile> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }

    const userData = await response.json();
    logger.debug({ userData });

    return {
      id: userData.id as number,
      name: userData.name ?? userData.login as string,
      username: userData.login as string,
      avatarUrl: userData["avatar_url"] as string,
    };
  }

  createLink() {
    const state: number = Math.floor(Math.random() * 1000000000);
    const encodeLink: string = encodeURIComponent(config.redirect);
    const encodeScope: string = encodeURIComponent(config.scope);
    const SampleLink =
      `https://github.com/login/oauth/authorize?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeLink}&state=${state}&scope=${encodeScope}`;
    return SampleLink;
  }
}

export const client = new GitHubClient();

export const AUTH_KEY = "gh_auth_key";

export const getTokenFromCookies = (req: Request) =>
  getCookies(req.headers)[AUTH_KEY];

export const setAuthCookie = (req: Request, accessToken: string) => {
  const url = new URL(req.url);
  const cookie: Cookie = {
    name: AUTH_KEY,
    value: accessToken,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "Lax", // this is important to prevent CSRF attacks
    domain: url.hostname,
    path: "/",
    secure: true,
  };

  const headers = new Headers({ location: url.origin });
  setCookie(headers, cookie);

  return headers;
};

export const deleteAuth = (req: Request) => {
  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  deleteCookie(headers, AUTH_KEY, { path: "/", domain: url.hostname });

  return headers;
};
