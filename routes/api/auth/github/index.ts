import { HandlerContext, Handlers } from "$fresh/server.ts";
import { GitHubObject } from "#/routes/api/auth/github/client.ts";

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    const redirectLink = GitHubObject.code.createLink();
    console.log({ req, ctx, redirectLink });
    return Response.redirect(redirectLink);
  },

  POST(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return new Response("Hello form github callback");
  },
};
