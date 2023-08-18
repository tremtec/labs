import { assert, assertThrows } from "$std/assert/mod.ts";
import { injector } from "~/shared/di.ts";

Deno.test("Injector", async (t) => {
  class ServiceA {}
  class ServiceB {}
  injector
    .register(ServiceA)
    .register(ServiceB);

  await t.step("get a value from the injector", () => {
    const svc = injector.get(ServiceA);

    assert(svc instanceof ServiceA);
  });

  await t.step("throw if no instance registered", () => {
    class UnregisteredService {}
    assertThrows(() => {
      injector.get(UnregisteredService);
    });
  });
});
