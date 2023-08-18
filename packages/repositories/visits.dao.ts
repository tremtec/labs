import { logger } from "~/shared/logging.ts";
import { Database } from "~/repositories/db.ts";
import { injector } from "~/shared/di.ts";

enum Keys {
  daily_visits,
  visits,
}

export type Visits = {
  visits: number;
  dailyVisits: number;
};

export class VisitsDao {
  private database = injector.get(Database);

  async addVisit() {
    const { dailyVisits, visits } = await this.getVisits();

    const kv = await this.database.connect();
    const res = await kv.atomic().set(
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

  private counter = async (key: Deno.KvKey) => {
    const kv = await this.database.connect();
    return kv.get<number>(key).then(({ value }) => value ?? 0);
  };

  private parseToDateString = (date: Date) =>
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).toString();
}
