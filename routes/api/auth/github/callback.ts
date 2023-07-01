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
  logger.info({ code });

  // persist session
  const accessToken = await client.getAccessToken(code);
  const redirectUrl = new URL(req.url).origin;
  const cookie: Cookie = {
    name: AUTH_KEY,
    value: accessToken,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  }

  logger.info({
    redirectUrl,
    accessToken,
    cookie,
  });

  const response = Response.redirect(redirectUrl);
  const authHeader = new Headers();
  setCookie(authHeader, cookie);

  logger.info({ response, authHeader });

  return {...response, headers: authHeader}
};
