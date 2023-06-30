import { Meta } from "~/components/Meta.tsx";
import { NavBar } from "~/components/NavBar.tsx";
import { WithChildren } from "~/shared/types.ts";

export default function MainLayout(props: WithChildren) {
  return (
    <div class="h-screen">
      <Meta />
      <NavBar />
      {props.children}
    </div>
  );
}
