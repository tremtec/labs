import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { github } from "#/settings.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  return client.cookieAccessToken(req)
    ? await ctx.next()
    : Response.redirect(github.logoutUrl);
}
