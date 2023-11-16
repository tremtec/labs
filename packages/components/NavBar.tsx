import ThemeSwitcher from "#/islands/ThemeSwitcher.tsx";
import { github, site } from "#/settings.ts";
import TremTecLogo from "~/icon/TremTecLogo.tsx";
import GithubIcon from "~/icon/GitHubIcon.tsx";
import { WithUserProfile } from "~/entities/userProfile.ts";

export const NavBar = ({ userProfile }: Partial<WithUserProfile>) => (
  <div class="flex items-center justify-between gap-4 px-4 py-8 mx-auto max-w-screen-md">
    <a href="/">
      <Logo />
    </a>

    <div class="flex gap-2 justify-center items-center">
      <ThemeSwitcher />

      {userProfile
        ? <Avatar userProfile={userProfile} />
        : (
          <a class="btn btn-outline" href={github.signInUrl}>
            <GithubIcon />
            Sign In
          </a>
        )}
    </div>
  </div>
);

const Avatar = ({ userProfile }: WithUserProfile) => {
  // const isOpen = useSignal(false);
  const isOpen = false;
  return (
    <a class="relative btn btn-ghost btn-circle" href={github.dashboardUrl}>
      <div class="avatar online">
        <div class="w-8 rounded-full" // onClick={() => isOpen.value = !isOpen.value}
        >
          <img src={userProfile.avatarUrl} title={userProfile.name} />
        </div>
      </div>

      {isOpen && (
        <ul class="menu absolute right-[-2rem] bg-base-200 w-56 rounded-box">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      )}
    </a>
  );
};

const Logo = () => (
  <span class="flex items-center gap-2">
    <TremTecLogo />
    <span>
      {site.name}.<span class="font-bold">labs</span>
    </span>
  </span>
);
