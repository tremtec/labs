import * as log from "$std/log/mod.ts";
import { Handler } from "$fresh/server.ts";
import { client, setAuthCookie } from "~/services/github.ts";

const logger = log.getLogger("auth");

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render(false);
  }

  // TODO: save User to DB
  logger.info("code: ", { code });

  // persist session
  const accessToken = await client.getAccessToken(code);
  const redirectUrl = url.origin;
  const headers = setAuthCookie(req, accessToken);

  logger.info("redirect info", {
    redirectUrl,
    accessToken,
  });

  return new Response(null, {
    status: 302,
    headers,
  });
};
