import TremTecLogo from "~/icon/TremTecLogo.tsx";
import MainLayout from "~/components/layouts/MainLayout.tsx";

import { site } from "#/settings.ts";
import { addVisit, getVisits, Visits } from "~/shared/db.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<Visits> = {
  async GET(req, ctx) {
    await addVisit();
    const visits = await getVisits();
    return ctx.render(visits);
  },
};

export default function Home(props: PageProps<Visits>) {
  const { dailyVisits, visits } = props.data;
  const percentageOfVisitsToday = 100 * dailyVisits / visits;
  const textVisits = `This page received ${dailyVisits} visits today`;
  const textVisitsPercentage = `${dailyVisits}/${visits} (${
    percentageOfVisitsToday.toFixed(2)
  }% on the total)`;

  return (
    <MainLayout>
      <div class="p-4 mx-auto max-w-screen-md text-center flex flex-col gap-8 items-center">
        <h1 class="text-2xl">
          <TremTecLogo size={240} class="animate-bounce hover:animate-ping" />
          {site.name}
        </h1>

        <h2>{site.subTitle}</h2>

        <div class="text-gray-500 text-xs">
          <p>{textVisits}</p>
          <p class="text-xs">{textVisitsPercentage}</p>
        </div>

        <form action="/api/auth/github">
          <button title="login via github">Github</button>
        </form>
      </div>
    </MainLayout>
  );
}
