import { visits } from "~/repositories/visits.dao.ts";

class VisitsService {
  async getVisits() {
    await visits.addVisit();
    return visits.getVisits();
  }
}

export const visitsService = new VisitsService();
