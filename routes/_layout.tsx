import { defineLayout } from "$fresh/server.ts";
import MainLayout from "~/components/layouts/MainLayout.tsx";
import { client } from "~/services/github.ts";

export default defineLayout(async (req, ctx) => {
  const userProfile = await client
    .fetchAuthenticatedUser(req)
    .catch(() => undefined);
  return (
    <MainLayout userProfile={userProfile}>
      <ctx.Component />
    </MainLayout>
  );
});
