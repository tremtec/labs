import { Handler } from "$fresh/server.ts";
import { deleteAuth } from "~/services/github.ts";

export const handler: Handler = (req) => {
  const headers = deleteAuth(req);
  headers.set("location", "/");

  return new Response(null, {
    status: 302,
    headers,
  });
};
