import { Handler } from "$fresh/server.ts";
import { client } from "~/services/github.ts";

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render(false);
  }

  // TODO: save User to DB

  // persist session
  const headers = await client.persistAuthToken(code, req);

  // redirect to app
  headers.set("location", `${url.origin}/app`);

  return new Response(null, {
    status: 302,
    headers,
  });
};
