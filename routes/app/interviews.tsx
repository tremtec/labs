import AppLayout from "~/components/layouts/AppLayout.tsx";

import { PageProps } from "$fresh/server.ts";
import WorkInProgress from "~/components/WorkInProgress.tsx";

export default function Interviews(props: PageProps) {
  return (
    <AppLayout path={props.url.pathname}>
      <div class="text-left grid gap-8">
        <h1 class="text-3xl">Interviews</h1>

        <WorkInProgress />
      </div>
    </AppLayout>
  );
}
