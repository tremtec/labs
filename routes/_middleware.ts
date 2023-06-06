import { cookieSession } from "$fresh_session/mod.ts";

const session = cookieSession()

export const handler = [session];
