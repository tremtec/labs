import { HandlerContext, Handlers } from "$fresh/server.ts";
import { GitHubObject } from "./client.ts";

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
