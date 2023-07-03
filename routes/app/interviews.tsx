import AppLayout from "~/components/layouts/AppLayout.tsx";

import { PageProps } from "$fresh/server.ts";

export default function Interviews(props: PageProps) {
  return (
    <AppLayout path={props.url.pathname}>
      <div class="text-left">
        <h1 class="text-3xl">🧾 Interviews</h1>
      </div>
    </AppLayout>
  );
}
