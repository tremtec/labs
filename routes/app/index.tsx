import { client } from "~/services/github.ts";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute(async (req) => {
  const userProfile = await client.fetchAuthenticatedUser(req);
  return (
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
  );
});
