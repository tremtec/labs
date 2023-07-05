import { Handler } from "$fresh/server.ts";
import { cookies } from "~/services/github.ts";

export const handler: Handler = (req) => {
  const headers = cookies.deleteAuthToken(req);
  headers.set("location", "/");

  return new Response(null, {
    status: 302,
    headers,
  });
};
