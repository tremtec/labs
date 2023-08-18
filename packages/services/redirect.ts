import { cookies } from "~/services/github.ts";

class RedirectService {
  redirectToProtect(req: Request) {
    const url = new URL(req.url);
    const isProtectedRoute = url.pathname.startsWith("/app");
    const hasAuthCookie = Boolean(cookies.getAccessToken(req));

    if (!hasAuthCookie || isProtectedRoute) return;

    return Response.redirect(url.origin + "/app");
  }
}

export const redirectService = new RedirectService();
