import { github, privateNavLinks } from "#/settings.ts";
import { WithChildren } from "~/shared/types.ts";
import MainLayout from "~/components/layouts/MainLayout.tsx";
import { cls } from "~/shared/tw.tsx";

type Props = WithChildren & {
  path: string;
};

export default function AppLayout({ path, children }: Props) {
  const Link = ({ href = "", text = "" }) => (
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

  const NavBar = () => (
    <nav class="gap-4 flex pb-4">
      {privateNavLinks.map((link) => (
        <Link
          href={link.link}
          text={link.name}
        />
      ))}
      <div class="flex-1" />
      <Link href={github.logoutUrl} text="Logout" />
    </nav>
  );

  return (
    <MainLayout>
      <div class="w-full grid gap-8 text-gray-600 dark:text-gray-400 text-sm">
        <NavBar />
        {children}
      </div>
    </MainLayout>
  );
}
