import { client } from "~/services/github.ts";
import { defineRoute } from "$fresh/server.ts";
import GithubIcon from "~/icon/GitHubIcon.tsx";
import { kv } from "~/repositories/db.ts";
import { OrderDao } from "~/repositories/order.ts";

export default defineRoute(async (req) => {
  const userProfile = await client.fetchAuthenticatedUser(req);
  const orderRepository = new OrderDao(kv, userProfile.id);
  await orderRepository.upsertOrder({
    author_id: userProfile.id,
    title: "new title",
    description: "new title",
  });
  const orders = await orderRepository.list();
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

      <div>
        <h2>Orders</h2>

        {orders.map((o) => (
          <div class="card">
            <p>{o?.title}</p>
            <p>{o?.description}</p>
            <p>{o?.author_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
