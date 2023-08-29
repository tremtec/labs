import { github, site } from "#/settings.ts";
import { logger } from "~/shared/logging.ts";
import { defineRoute } from "$fresh/server.ts";
import { visitsService } from "~/services/visits.ts";
import TremTecLogo from "~/icon/TremTecLogo.tsx";
import GithubIcon from "~/icon/GitHubIcon.tsx";

export default defineRoute(async () => {
  const data = await visitsService.getVisits();
  logger.debug(data);

  const { dailyVisits, visits } = data;
  const percentageOfVisitsToday = (100 * dailyVisits / visits).toFixed(2);
  const textVisits = `This page received ${dailyVisits} visits today`;
  const textPercentage =
    `${dailyVisits}/${visits} (${percentageOfVisitsToday}% on the total)`;

  return (
    <>
      <div class="text-center flex flex-col gap-8 items-center">
        <h1 class="text-4xl">
          <TremTecLogo size={240} class="animate-bounce hover:animate-ping" />
          {site.name}
        </h1>

        <h2 class="text-sm">{site.subTitle}</h2>

        <form action={github.signInUrl}>
          <button
            title="login via github"
            class="btn btn-primary"
            type="submit"
          >
            <GithubIcon />
            Login
          </button>
        </form>

        <div class="text-gray-500 text-sm">
          <p>{textVisits}</p>
          <p class="text-xs">{textPercentage}</p>
        </div>
      </div>
    </>
  );
});
