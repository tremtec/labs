import TremTecLogo from "~/icon/TremTecLogo.tsx";
import MainLayout from "~/components/layouts/MainLayout.tsx";

import { github, site } from "#/settings.ts";
import { logger } from "~/shared/logging.ts";
import { addVisit, getVisits, Visits } from "~/shared/db.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { cookies } from "~/services/github.ts";

type Data = {
  visits: Visits;
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    if (cookies.getAuthToken(req)) {
      return Response.redirect(url.origin + "/app");
    }

    await addVisit();

    const visits = await getVisits();
    logger.debug({ visits });

    return ctx.render({ visits });
  },
};

export default function Home(props: PageProps<Data>) {
  const { dailyVisits, visits } = props.data.visits;
  const percentageOfVisitsToday = (100 * dailyVisits / visits).toFixed(2);
  const textVisits = `This page received ${dailyVisits} visits today`;
  const textPercentage =
    `${dailyVisits}/${visits} (${percentageOfVisitsToday}% on the total)`;

  return (
    <MainLayout>
      <div class="text-center flex flex-col gap-8 items-center">
        <h1 class="text-2xl">
          <TremTecLogo size={240} class="animate-bounce hover:animate-ping" />
          {site.name}
        </h1>

        <h2>{site.subTitle}</h2>

        <div class="text-gray-500 text-xs">
          <p>{textVisits}</p>
          <p class="text-xs">{textPercentage}</p>
        </div>

        <form action={github.signInUrl}>
          <button title="login via github">Github</button>
        </form>
      </div>
    </MainLayout>
  );
}
