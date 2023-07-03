import AppLayout from "~/components/layouts/AppLayout.tsx";

import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { UserProfile } from "#/entities/userProfile.ts";
import { UserProfileNotFound } from "#/entities/exceptions.ts";

type Data = {
  userProfile: UserProfile;
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const userProfile = await client.getAuthenticatedUser(req);
    if (!userProfile) throw UserProfileNotFound;
    return ctx.render({ userProfile });
  },
};

export default function Profile(props: PageProps<Data>) {
  const { userProfile } = props.data;
  return (
    <AppLayout path={props.url.pathname}>
      <div class="grid gap-8 text-left grid-cols-3">
        <img
          width={240}
          height={240}
          class="rounded-full"
          alt={`Welcome ${userProfile.name} 🎉`}
          src={userProfile.avatarUrl}
        />

        <div class="col-span-2 flex flex-col gap-2">
          <h1 class="text-3xl">
            Welcome {userProfile.name} 🎉
          </h1>
          <h2 class="text-gray-600">
            @{userProfile.username}
          </h2>
        </div>
      </div>
    </AppLayout>
  );
}
