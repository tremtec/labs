import { Handler } from "$fresh/server.ts";
import { logger } from "~/shared/logging.ts";
import { client, setAuthCookie } from "~/services/github.ts";

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render(false);
  }

  // TODO: save User to DB
  logger.info({ code });

  // persist session
  const accessToken = await client.getAccessToken(code);
  const headers = setAuthCookie(req, accessToken);

  return new Response(null, {
    status: 302,
    headers,
  });
};
