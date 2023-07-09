import { Handlers } from "$fresh/server.ts";
import { logger } from "~/shared/logging.ts";
import { client } from "~/services/github.ts";

export const handler: Handlers = {
  GET(req) {
    const redirectLink = client.createLink(req);
    logger.info({ redirectLink });
    return Response.redirect(redirectLink);
  },
};
