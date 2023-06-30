import { HandlerContext, Handlers } from "$fresh/server.ts";
import { GitHubObject } from "#/routes/api/auth/github/client.ts";
import * as log from "https://deno.land/std@0.191.0/log/mod.ts";

const logger = log.getLogger("auth");

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    const redirectLink = GitHubObject.code.createLink();
    logger.info({ req, ctx, redirectLink });
    return Response.redirect(redirectLink);
  },

  POST(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return new Response("Hello form github callback");
  },
};
