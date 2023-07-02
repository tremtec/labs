import { HandlerContext, Handlers } from "$fresh/server.ts";
import { logger } from "~/shared/logging.ts";
import { client } from "~/services/github.ts";

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
