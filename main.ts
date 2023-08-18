/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { Manifest, start } from "$fresh/server.ts";
import manifest from "#/fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "#/twind.config.ts";
import { register } from "#/register.ts";

register();

await start(manifest as Manifest, { plugins: [twindPlugin(twindConfig)] });
