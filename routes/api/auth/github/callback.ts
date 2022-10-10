import { Handler } from "$fresh/server.ts";
import { GitHubObject } from "#/routes/api/auth/github/client.ts";

export const handler: Handler = async (req, ctx) => {
  console.log({ req, ctx });
  const url = new URL(req.url);
  const qs = new URLSearchParams(req.url);
  const userProfile = await GitHubObject.code.processAuth(url);

  return Response.json({
    error: qs.get("error"),
    error_description: qs.get("error_description"),
    // WIP: save code & state on cookies
    code: qs.get("code"),
    userProfile,
  });
};
