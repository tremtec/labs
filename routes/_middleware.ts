import { cookieSession, WithSession } from "$fresh_session/mod.ts";
import { MiddlewareHandler } from "$fresh/server.ts";

const session = cookieSession();

type State = WithSession & {
  theme: string;
};

export const handler: MiddlewareHandler<State>[] = [session];
