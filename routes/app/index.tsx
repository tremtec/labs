import { client } from "~/services/github.ts";
import { defineRoute } from "$fresh/server.ts";
import GithubIcon from "~/icon/GitHubIcon.tsx";

export default defineRoute(async (req) => {
  const userProfile = await client.fetchAuthenticatedUser(req);
  return (
    <div>
      <div class="card sm:card-side bg-base-100 shadow-xl text-left">
        <figure>
          <img
            alt={`Welcome ${userProfile.name} 🎉`}
            src={userProfile.avatarUrl}
          />
        </figure>

        <div class="card-body">
          <h1 class="text-3xl">
            <p>Welcome</p>
            <p>{userProfile.name} 🎉</p>
          </h1>

          <h2 class="text-gray-600">
            @{userProfile.username}
          </h2>

          <div>
            <p class="py-2 text-gray-500">About you</p>
            {userProfile.bio}
          </div>

          <div class="card-actions justify-end">
            <a
              class="btn btn-ghost"
              href={`https://github.com/${userProfile.username}`}
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
