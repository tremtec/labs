import TremTecLogo from "~/icon/TremTecLogo.tsx";
import { site } from "#/settings.ts";

export default function Home() {
  return (
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
  );
}
