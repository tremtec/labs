import ThemeSwitcher from "#/islands/ThemeSwitcher.tsx";
import { site } from "#/settings.ts";
import TremTecLogo from "~/icon/TremTecLogo.tsx";
import GithubIcon from "~/icon/GitHubIcon.tsx";

export const NavBar = () => (
  <div class="flex items-center justify-between gap-4 px-4 py-8 mx-auto max-w-screen-md">
    <a href="/">
      <Logo />
    </a>

    <div class="flex gap-2 justify-center items-center">
      <ThemeSwitcher />

      <a href={site.repository} target="_blank">
        <GithubIcon />
      </a>
    </div>
  </div>
);

const Logo = () => (
  <span class="flex items-center gap-2">
    <TremTecLogo />
    <span>
      {site.name}.<span class="font-bold">labs</span>
    </span>
  </span>
);
