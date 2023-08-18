import { cookies } from "~/services/github.ts";

class RedirectService {
  redirectToProtect(req: Request) {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/app")) return;
    if (!cookies.getAccessToken(req)) return;

    return Response.redirect(url.origin + "/app");
  }
}

export const redirectService = new RedirectService();
