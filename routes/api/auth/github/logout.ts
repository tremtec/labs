import { Handlers } from "$fresh/server.ts";
import { deleteAuth } from "~/services/github.ts";

export const handler: Handlers = {
  GET(req) {
    const headers = deleteAuth(req);
    headers.set("location", "/");

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
