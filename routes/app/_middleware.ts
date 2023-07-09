import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { github } from "#/settings.ts";
import { cookies } from "~/services/github.ts";
import { logger } from "~/shared/logging.ts";

export function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const url = new URL(req.url);
  const authToken = cookies.getAccessToken(req);
  if (authToken) return ctx.next();

  logger.debug({ info: "auth token expired" });

  const refreshToken = cookies.getRefreshToken(req);
  if (refreshToken) {
    logger.debug({ info: "refreshing tokens" });
    return Response.redirect(url.origin + github.refreshUrl);
  }

  logger.debug({ info: "refresh token expired, redirecting to logout" });
  return Response.redirect(url.origin + github.logoutUrl);
}
