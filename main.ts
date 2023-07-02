/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import * as log from "$std/log/mod.ts";
import { Manifest, start } from "$fresh/server.ts";
import manifest from "#/fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "#/twind.config.ts";

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

await start(manifest as Manifest, { plugins: [twindPlugin(twindConfig)] });
