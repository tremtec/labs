import { Handler } from "$fresh/server.ts";
import { logger } from "~/shared/logging.ts";
import { deleteAuth } from "~/services/github.ts";

export const handler: Handler = (req) => {
  logger.info("deleting auth cookie");

  const headers = deleteAuth(req);
  headers.set("location", "/");
  logger.info({ headers });

  return new Response(null, {
    status: 302,
    headers,
  });
};
