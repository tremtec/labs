import { defineLayout } from "$fresh/server.ts";
import MainLayout from "~/components/layouts/MainLayout.tsx";
import { redirectService } from "~/services/redirect.ts";

export default defineLayout((req, ctx) => {
  const redirect = redirectService.redirectToProtect(req);
  if (redirect) return redirect;

  return (
    <MainLayout>
      <ctx.Component />
    </MainLayout>
  );
});
