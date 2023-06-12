import { Meta } from "~/components/Meta.tsx";
import { NavBar } from "~/components/NavBar.tsx";
import { WithChildren, WithTheme } from "~/shared/types.ts";

export default function MainLayout(props: WithTheme & WithChildren) {
  return (
    <div class="dark:bg-black dark:text-white h-screen">
      <Meta />
      <NavBar theme={props.theme} />
      {props.children}
    </div>
  );
}
