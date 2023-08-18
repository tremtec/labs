import { VisitsDao } from "~/repositories/visits.dao.ts";
import { injector } from "~/shared/di.ts";

export class VisitsService {
  private visits = injector.get(VisitsDao)

  async getVisits() {
    await this.visits.addVisit();
    return this.visits.getVisits();
  }
}
