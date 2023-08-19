import { defineLayout } from "$fresh/server.ts";
import MainLayout from "~/components/layouts/MainLayout.tsx";

export default defineLayout((_req, ctx) => {
  return (
    <MainLayout>
      <ctx.Component />
    </MainLayout>
  );
});
