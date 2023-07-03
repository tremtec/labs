import MainLayout from "~/components/layouts/MainLayout.tsx";

import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { UserProfile } from "#/entities/userProfile.ts";
import { github } from "#/settings.ts";

type Data = {
  userProfile: UserProfile;
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const userProfile = await client.getAuthenticatedUser(req);
    if (!userProfile) throw Error("User profile not found!");
    return ctx.render({ userProfile });
  },
};

export default function Home(props: PageProps<Data>) {
  const { userProfile } = props.data;
  return (
    <MainLayout>
      <div class="p-4 mx-auto max-w-screen-md text-center flex flex-col gap-8 items-center">
        <img
          width={240}
          height={240}
          class="rounded-full animate-bounce hover:animate-ping"
          alt={`Welcome ${userProfile.name} 🎉`}
          src={userProfile.avatarUrl}
        />

        <h1 class="text-2xl">
          Welcome @{userProfile.username} 🎉
        </h1>

        <form action={github.logoutUrl}>
          <button title="logout">Logout</button>
        </form>
      </div>
    </MainLayout>
  );
}
