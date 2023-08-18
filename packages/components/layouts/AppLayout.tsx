import { github, privateNavLinks } from "#/settings.ts";
import { WithChildren } from "~/shared/types.ts";
import { cls } from "~/shared/tw.tsx";

type Props = WithChildren & { path: string };

export default function AppLayout({ path, children }: Props) {
  return (
    <div class="w-full grid gap-8 text-gray-600 dark:text-gray-400 text-sm">
      <NavBar path={path} />
      {children}
    </div>
  );
}

const Link = ({ href = "", text = "", path = "" }) => (
  <a
    href={href}
    class={cls(
      "py-1 px-2 rounded-md border-1 border-transparent",
      "hover:bg-gray-200 dark:hover:bg-gray-700",
      "hover:border-gray-500 dark:hover:border-gray-300",
      href === path && "bg-gray-200 dark:bg-gray-700",
    )}
  >
    {text}
  </a>
);

const NavBar = ({ path = "" }) => (
  <nav class="gap-4 flex pb-4">
    {privateNavLinks.map((link) => (
      <Link
        href={link.link}
        text={link.name}
        path={path}
      />
    ))}
    <div class="flex-1" />
    <Link href={github.logoutUrl} text="Logout" />
  </nav>
);
