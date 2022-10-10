import { HandlerContext, Handlers } from "$fresh/server.ts";
import { GitHubClient } from "denoauth";
import { github } from "#/settings.ts";

console.log(github)

const GitHubObject = new GitHubClient({
  clientId: github.clientId,
  clientSecret: github.clientSecret,
  tokenUri: "https://github.com/login/oauth/access_token",
  redirect: "http://localhost:3000/api/auth/github", // The redirect uri is added in the GitHub OAuth developer settings
  scope: "read:user",
});

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return Response.redirect(GitHubObject.code.createLink());
  },

  POST(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return new Response("Hello form github callback");
  },
};
