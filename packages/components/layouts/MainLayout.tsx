import { Meta } from "~/components/Meta.tsx";
import { NavBar } from "~/components/NavBar.tsx";
import { WithChildren } from "~/shared/types.ts";

export default function MainLayout(props: WithChildren) {
  return (
    <div class="h-screen">
      <Meta />
      <NavBar />
      <div class="p-4 mx-auto max-w-screen-md text-center flex flex-col gap-8 items-center">
        {props.children}
      </div>
    </div>
  );
}
