import { defineRoute } from "$fresh/server.ts";
import { INSTALL_CMD } from "#/settings.ts";

export default defineRoute(() => {
  return new Response(INSTALL_CMD, {
    headers: { "Content-Type": "application/text" },
  });
});
