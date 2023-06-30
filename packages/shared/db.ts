const kv = await Deno.openKv();

enum Keys {
  daily_visits,
  visits,
}

export async function addVisit() {
  const { dailyVisits, visits } = await getVisits();
  const res = await kv.atomic()
    .set(
      [Keys.daily_visits, parseToDateString(new Date())],
      dailyVisits + 1,
    )
    .set([Keys.visits], visits + 1)
    .commit();

  if (!res.ok) {
    console.error("=== ERROR ===");
    console.error(res);
  }
  return res.ok;
}

export type Visits = {
  visits: number;
  dailyVisits: number;
};

export const getVisits = async (): Promise<Visits> => {
  const [visits, dailyVisits] = await Promise.all([
    fetchVisits(),
    fetchDailyVisits(),
  ]);
  return { visits, dailyVisits };
};

const fetchVisits = () => counter([Keys.visits]);

const fetchDailyVisits = (date = new Date()) =>
  counter([Keys.daily_visits, parseToDateString(date)]);

const counter = (key: Deno.KvKey) =>
  kv.get<number>(key).then(({ value }) => value ?? 0);

const parseToDateString = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).toString();
