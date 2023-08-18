import { injector } from "~/shared/di.ts";
import { Database } from "~/repositories/db.ts";
import { VisitsDao } from "~/repositories/visits.dao.ts";
import { VisitsService } from "~/services/visits.ts";

export function register() {
  injector
    .register(Database)
    .register(VisitsDao)
    .register(VisitsService);
}
