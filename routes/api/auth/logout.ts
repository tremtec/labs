import { Handler } from "$fresh/server.ts";
import { cookies } from "~/services/github.ts";
import { logger } from "~/shared/logging.ts";

export const handler: Handler = (req) => {
  logger.debug({ info: "logout user" });
  return new Response(null, {
    status: 302,
    headers: cookies.deleteAuthToken(req),
  });
};
