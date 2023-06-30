import { GitHubClient } from "denoauth";
import { github } from "#/settings.ts";

export const GitHubObject = new GitHubClient({
  clientId: github.clientId,
  clientSecret: github.clientSecret,
  tokenUri: "https://github.com/login/oauth/access_token",
  redirect: "https://tremtec.deno.dev/api/auth/github/callback", // The redirect uri is added in the GitHub OAuth developer settings
  scope: "read:user",
});
