import { github } from "#/settings.ts";
import { WithChildren } from "~/shared/types.ts";
import MainLayout from "~/components/layouts/MainLayout.tsx";
import { cls } from "~/shared/tw.tsx";

export default function AppLayout(props: WithChildren) {
  return (
    <MainLayout>
      <div class="w-full grid gap-24 text-gray-600 dark:text-gray-400 text-sm">
        <nav class="gap-4 flex">
          <Link href="/app#1" text="Dashboard" />
          <Link href="/app#2" text="Interview" />
          <Link href="/app#3" text="Profile" />

          <div class="flex-1" />

          <Link href={github.logoutUrl} text="Logout" />
        </nav>
        {props.children}
      </div>
    </MainLayout>
  );
}

const Link = ({ href = "", text = "" }) => (
  <a
    href={href}
    class="hover:border-b-2 selected:border-b-2"
  >
    {text}
  </a>
);
