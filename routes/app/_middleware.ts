import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { github } from "#/settings.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const url = new URL(req.url);
  if (!client.cookieAccessToken(req)) {
    return Response.redirect(url.origin + github.logoutUrl);
  }
  return await ctx.next();
}
