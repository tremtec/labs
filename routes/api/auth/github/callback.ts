import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return new Response("GET: Hello form github callback");
  },

  POST(req: Request, ctx: HandlerContext) {
    console.log({ req, ctx });
    return new Response("POST: Hello form github callback");
  },
};
