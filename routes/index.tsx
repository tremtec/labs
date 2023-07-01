import TremTecLogo from "~/icon/TremTecLogo.tsx";
import MainLayout from "~/components/layouts/MainLayout.tsx";

import { site } from "#/settings.ts";
import { addVisit, getVisits, Visits } from "~/shared/db.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { client, getTokenFromCookies } from "~/services/github.ts";

type Profile = any;

type Data = {
  visits: Visits;
  // TODO: fix typing
  userProfile: null | Profile;
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    await addVisit();
    const visits = await getVisits();

    // Get cookie from request header and parse it
    const accessToken = getTokenFromCookies(req);
    if (!accessToken) {
      return ctx.render({ visits, userProfile: null });
    }

    const userProfile = await client.getUserData(accessToken);
    return ctx.render({ visits, userProfile });
  },
};

export default function Home(props: PageProps<Data>) {
  const { dailyVisits, visits } = props.data.visits;
  const { userProfile } = props.data;
  const percentageOfVisitsToday = (100 * dailyVisits / visits).toFixed(2);
  const textVisits = `This page received ${dailyVisits} visits today`;
  const textPercentage =
    `${dailyVisits}/${visits} (${percentageOfVisitsToday}% on the total)`;

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
          <p class="text-xs">{textPercentage}</p>
        </div>

        {!userProfile
          ? (
            <form action="/api/auth/github">
              <button title="login via github">Github</button>
            </form>
          )
          : (
            <>
              <p>Welcome ${userProfile.name}! 🎉</p>
              <form action="/api/auth/logout">
                <button title="logout">Logout</button>
              </form>
            </>
          )}
      </div>
    </MainLayout>
  );
}
