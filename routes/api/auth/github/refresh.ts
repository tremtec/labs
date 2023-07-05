import { Handler } from "$fresh/server.ts";
import { github } from "#/settings.ts";
import { logger } from "~/shared/logging.ts";
import { client } from "~/services/github.ts";

export const handler: Handler = async (req) => {
  logger.info("refreshing token expired");

  const url = new URL(req.url);
  const headers = await client.refreshAuthToken(req);

  if (!headers) {
    logger.info("cannot refresh, logging out");
    return Response.redirect(url.origin + github.logoutUrl);
  }

  // TODO: redirect to origin
  headers.set("location", `${url.origin}/app`);

  return new Response(null, {
    status: 302,
    headers,
  });
};
