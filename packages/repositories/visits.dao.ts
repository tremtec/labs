import { logger } from "~/shared/logging.ts";
import { kv } from "~/repositories/db.ts";

enum Keys {
  daily_visits,
  visits,
}

export type Visits = {
  visits: number;
  dailyVisits: number;
};

class VisitsDao {
  constructor(private kv: Deno.Kv) {}

  async addVisit() {
    const { dailyVisits, visits } = await this.getVisits();
    const res = await this.kv.atomic()
      .set(
        [Keys.daily_visits, this.parseToDateString(new Date())],
        dailyVisits + 1,
      )
      .set([Keys.visits], visits + 1)
      .commit();

    if (!res.ok) {
      logger.error({ info: "=== ERROR ===", res });
    }
    return res.ok;
  }

  async getVisits(): Promise<Visits> {
    const [visits, dailyVisits] = await Promise.all([
      this.fetchVisits(),
      this.fetchDailyVisits(),
    ]);
    return { visits, dailyVisits };
  }

  private fetchVisits = () => this.counter([Keys.visits]);

  private fetchDailyVisits = (date = new Date()) =>
    this.counter([Keys.daily_visits, this.parseToDateString(date)]);

  private counter = (key: Deno.KvKey) =>
    this.kv.get<number>(key).then(({ value }) => value ?? 0);

  private parseToDateString = (date: Date) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toString();
}

export const visits = new VisitsDao(kv);
