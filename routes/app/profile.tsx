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
      <div class="grid gap-8 text-center sm:text-left sm:grid-cols-3">
        <img
          width={240}
          height={240}
          class="rounded-full mx-auto"
          alt={`Welcome ${userProfile.name} 🎉`}
          src={userProfile.avatarUrl}
        />

        <div class="sm:col-span-2 flex flex-col gap-2">
          <h1 class="text-3xl">
            Welcome {userProfile.name} 🎉
          </h1>

          <h2 class="text-gray-600">
            @{userProfile.username}
          </h2>

          <div>
            <p class="py-2 text-gray-500">About you</p>
            {userProfile.bio.split("\n").map((p) => <p class="px-2">{p}</p>)}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
