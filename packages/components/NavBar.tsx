import ThemeSwitcher from "#/islands/ThemeSwitcher.tsx";
import { github, site } from "#/settings.ts";
import TremTecLogo from "~/icon/TremTecLogo.tsx";
import GithubIcon from "~/icon/GitHubIcon.tsx";
import { WithUserProfile } from "#/entities/userProfile.ts";

export const NavBar = ({ userProfile }: Partial<WithUserProfile>) => (
  <div class="flex items-center justify-between gap-4 px-4 py-8 mx-auto max-w-screen-md">
    <a href="/">
      <Logo />
    </a>

    <div class="flex gap-2 justify-center items-center">
      <ThemeSwitcher />

      {userProfile
        ? (
          <div class="avatar online">
            <div class="w-24 rounded-full">
              <img src={userProfile.avatarUrl} title={userProfile.name} />
            </div>
          </div>
        )
        : (
          <a class="btn btn-outline" href={github.signInUrl}>
            <GithubIcon />
            Sign In
          </a>
        )}
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
