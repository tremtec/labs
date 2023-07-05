import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { github } from "#/settings.ts";
import { client, cookies } from "~/services/github.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const url = new URL(req.url);
  const authToken = cookies.getAuthToken(req);
  if (!authToken) {
    return Response.redirect(url.origin + github.logoutUrl);
  }

  const tokenExpired = await client.isTokenExpired(authToken);
  if (tokenExpired) {
    return Response.redirect(url.origin + github.refreshUrl);
  }

  return ctx.next();
}
