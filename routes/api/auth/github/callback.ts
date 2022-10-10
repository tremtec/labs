import { Handler } from "$fresh/server.ts";

export const handler: Handler = (req, ctx) => {
  console.log({ req, ctx });
  const qs = new URLSearchParams(req.url);
  return new Response(
    JSON.stringify({
      code: qs.get("code"),
      state: qs.get("state"),
      // WIP: save code & state on cookies
      error: qs.get("error"),
      error_description: qs.get("error_description"),
    }),
  );
};
