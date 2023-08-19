import * as assert from "$std/assert/mod.ts";
import { redirectService } from "~/services/redirect.ts";
import { Cookie, setCookie } from "$std/http/cookie.ts";

Deno.test("Redirect Service", async (t) => {
  const origin = "http://localhost";
  const cookie: Cookie = {
    name: "access_token",
    value: "some-token",
    maxAge: 1_000,
    domain: origin,
    path: "/",
  };
  const headers = new Headers({ location: origin });
  setCookie(headers, cookie);
  headers.set("Cookie", headers.get("set-cookie") ?? "");

  await t.step("should stay if no cookie", () => {
    const req = new Request(origin);
    const redirect = redirectService.redirectToProtect(req);

    assert.assertEquals(redirect, undefined);
  });

  await t.step("should stay if has cookie and already in private route", () => {
    const req = new Request(`${origin}/app`, { headers });
    const redirect = redirectService.redirectToProtect(req);

    assert.assertEquals(redirect, undefined);
  });

  await t.step("should redirect if has auth and not on protected route", () => {
    const req = new Request(origin, { headers });
    const redirect = redirectService.redirectToProtect(req);

    assert.assertExists(redirect);
  });
});
