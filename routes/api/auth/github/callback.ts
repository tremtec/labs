import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    const qs = new URLSearchParams(req.url)
    return new Response(JSON.stringify({
      error: qs.get('error'),
      error_description: qs.get('error_description'),
    }));
  },

  POST(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    const qs = new URLSearchParams(req.url)
    return new Response(JSON.stringify({
      error: qs.get('error'),
      error_description: qs.get('error_description'),
    }));
  },
};
