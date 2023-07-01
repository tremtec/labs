import { HandlerContext, Handlers } from "$fresh/server.ts";
import * as log from "$std/log/mod.ts";
import { client } from "~/services/github.ts";

const logger = log.getLogger("auth");

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    const redirectLink = client.createLink();
    logger.info({ req, ctx, redirectLink });
    return Response.redirect(redirectLink);
  },

  POST(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return new Response("Hello form github callback");
  },
};
