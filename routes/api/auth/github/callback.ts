import { setCookie } from "$std/http/cookie.ts";
import { Handler } from "$fresh/server.ts";
import { AUTH_KEY, client } from "~/services/github.ts";


export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render(false);
  }

  // TODO: save to DB

  // persist session
  const accessToken = await client.getAccessToken(code)
  const response = Response.redirect("/")
  setCookie(response.headers, {
    name: AUTH_KEY,
    value: accessToken,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  })

  return response;
};
