import { Cookie, setCookie } from "$std/http/cookie.ts";
import * as log from "$std/log/mod.ts";
import { Handler } from "$fresh/server.ts";
import { AUTH_KEY, client } from "~/services/github.ts";

const logger = log.getLogger("auth");

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render(false);
  }

  // TODO: save User to DB
  logger.debug("code: ", { code });

  // persist session
  const accessToken = await client.getAccessToken(code);
  const redirectUrl = url.origin;
  const cookie: Cookie = {
    name: AUTH_KEY,
    value: accessToken,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    path: "/"
  };

  logger.info("redirect info", {
    redirectUrl,
    accessToken,
    cookie,
  });

  const headers = new Headers({ location: redirectUrl });
  setCookie(headers, cookie);

  return new Response(null, {
    status: 302,
    headers,
  });
};
