import { Handler } from "$fresh/server.ts";
import { GitHubObject } from "~/shared/auth.ts";

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  const qs = new URLSearchParams(url.searchParams);
  const queryParams = Object.fromEntries(qs.entries())
  const userProfile = await GitHubObject.code.processAuth(url);

  console.log({
    ctx,
    queryParams,
  });

  return Response.json({
    error: qs.get("error"),
    error_description: qs.get("error_description"),
    // WIP: save code & state on cookies
    code: qs.get("code"),
    userProfile,
  });
};
