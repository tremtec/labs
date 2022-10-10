import { Handler } from "$fresh/server.ts";
import { GitHubObject } from "./client.ts";

export const handler: Handler = async (req, ctx) => {
  console.log({ req, ctx });
  const qs = new URLSearchParams(req.url);
  const userProfile = await GitHubObject.code.processAuth(req.url);

  return new Response(
    JSON.stringify({
      error: qs.get("error"),
      error_description: qs.get("error_description"),
      // WIP: save code & state on cookies
      code: qs.get("code"),
      userProfile,
    }),
  );
};
