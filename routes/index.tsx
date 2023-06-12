import TremTecLogo from "~/icon/TremTecLogo.tsx";
import MainLayout from "~/components/layouts/MainLayout.tsx";

import { Handlers, PageProps } from "$fresh/server.ts";
import { WithSession } from "$fresh_session/mod.ts";
import { Theme, WithTheme } from "~/shared/types.ts";
import { site } from "#/settings.ts";

type Data = WithTheme;

export const handler: Handlers<Data, WithTheme & WithSession> = {
  GET(_req, ctx) {
    const theme: Theme = ctx.state.session.get("theme") ?? "dark";
    return ctx.render({ theme });
  },
  async POST(req, ctx) {
    const theme = await req.text() as Theme;
    ctx.state.session.set("theme", theme);

    return ctx.render({ theme });
  },
};

export default function Home(props: PageProps<Data>) {
  const { theme } = props.data;
  return (
    <MainLayout theme={theme}>
      <div class="p-4 mx-auto max-w-screen-md text-center flex flex-col gap-8 items-center">
        <h1 class="text-2xl">
          <TremTecLogo size={240} class="animate-bounce hover:animate-ping" />
          {site.name}
        </h1>

        <h2>{site.subTitle}</h2>

        <form action="/api/auth/github">
          <button title="login via github">Github</button>
        </form>
      </div>
    </MainLayout>
  );
}
