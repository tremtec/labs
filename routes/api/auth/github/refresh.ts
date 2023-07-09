import { Handler } from "$fresh/server.ts";
import { github } from "#/settings.ts";
import { logger } from "~/shared/logging.ts";
import { client } from "~/services/github.ts";

export const handler: Handler = async (req) => {
  logger.info({ info: "refreshing tokens" });

  const url = new URL(req.url);
  const headers = await client.refreshAuthToken(req);

  if (!headers) {
    logger.info({ info: "cannot refresh, logging out" });
    return Response.redirect(url.origin + github.logoutUrl);
  }

  logger.info({ info: "tokens refreshed, redirect to app" });
  headers.set("location", `${url.origin}/app`);

  return new Response(null, {
    status: 302,
    headers,
  });
};
