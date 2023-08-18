import { assert } from "$std/assert/assert.ts";
import { walk } from "https://deno.land/std@0.193.0/fs/walk.ts";
import { injector } from "~/shared/di.ts";

class VisitsDao {
  visist = 1;
  addVisit = () => this.visist++;
  getVisits = () => ({
    visits: this.visist,
    dailyVisits: this.visist,
  });
}

Deno.test("Visists Service", async (t) => {
  const { VisitsService } = await import("~/services/visits.ts");
  injector
    .register(VisitsDao)
    .register(VisitsService);

  const dao = injector.get(VisitsDao);
  const service = injector.get(VisitsService);

  await t.step("get visits should increment counter", async () => {
    const counter = dao.visist + 1;
    const { visits, dailyVisits } = await service.getVisits();

    console.log({ visits, dailyVisits }, injector);
    assert(visits === counter);
    assert(dailyVisits === counter);
  });

  injector.drop();
});
