import { HandlerContext, Handlers } from "$fresh/server.ts";
import { logger } from "~/shared/logging.ts";

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    logger.info({ req, ctx });
    return new Response("GET: Hello form github webhook");
  },

  POST(req: Request, ctx: HandlerContext) {
    logger.info({ req, ctx });
    return new Response("POST: Hello form github webhook");
  },
};
