import { defineLayout } from "$fresh/server.ts";
import AppLayout from "~/components/layouts/AppLayout.tsx";

export default defineLayout((req, ctx) => {
  const url = new URL(req.url);
  return (
    <AppLayout path={url.pathname}>
      <ctx.Component />
    </AppLayout>
  );
});
