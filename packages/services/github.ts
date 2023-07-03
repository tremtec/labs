import { github } from "#/settings.ts";
import { logger } from "~/shared/logging.ts";
import {
  Cookie,
  deleteCookie,
  getCookies,
  setCookie,
} from "$std/http/cookie.ts";
import { UserProfile } from "#/entities/userProfile.ts";

export class GitHubClient {
  cookieAccessToken(req: Request): string | null {
    // Get cookie from request header and parse it
    const value = getCookies(req.headers)[github.cookieAuthKey] ?? "";
    if (value.trim() === "") return null;
    return value;
  }

  createLink(req: Request) {
    const url = new URL(req.url);
    const state: number = Math.floor(Math.random() * 1000000000);
    const encodeLink: string = encodeURIComponent(
      url.origin + github.callbackUrl,
    );
    const encodeScope: string = encodeURIComponent(github.scope);
    const SampleLink =
      `https://github.com/login/oauth/authorize?response_type=code&client_id=${github.clientId}&redirect_uri=${encodeLink}&state=${state}&scope=${encodeScope}`;
    return SampleLink;
  }

  async getAuthenticatedUser(req: Request): Promise<UserProfile | null> {
    // Get cookie from request header and parse it
    const accessToken = this.cookieAccessToken(req);
    if (!accessToken) return null;

    // TODO: refresh auth token
    return await client.getUserData(accessToken);
  }

  async getAccessToken(code: string) {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        body: JSON.stringify({
          client_id: github.clientId,
          client_secret: github.clientSecret,
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

  private async getUserData(accessToken: string): Promise<UserProfile> {
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
}

export const client = new GitHubClient();

export const setAuthCookie = (req: Request, accessToken: string) => {
  const url = new URL(req.url);
  const cookie: Cookie = {
    name: github.cookieAuthKey,
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

  deleteCookie(headers, github.cookieAuthKey, {
    path: "/",
    domain: url.hostname,
  });

  return headers;
};
