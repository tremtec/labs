import { github } from "#/settings.ts";
import { getCookies } from "$std/http/cookie.ts";

export interface GitHubConfig {
  /** The client ID provided by the authorization server. */
  clientId: string;
  /** The client secret provided by the authorization server, if using a confidential client. Best practice to always keep secret in env file. */
  clientSecret: string;
  /** The URI of the client's redirection endpoint (sometimes also called callback URI). */
  redirect: string;
  /** The URI of the authorization server's token endpoint. */
  tokenUri: string;

  // Our implementation currently only works with scope set to 'read:user'
  /** Scopes to request with the authorization request. */
  scope: "read:user";
}

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
    if (typeof accessToken !== "string") {
      throw new Error("Access token was not a string.");
    }
    return accessToken;
  }

  async getUserData(accessToken: string) {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const userData = await response.json();
    return {
      userId: userData.id as number,
      userName: userData.login as string,
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
