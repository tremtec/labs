import AppLayout from "~/components/layouts/AppLayout.tsx";

import { Handlers, PageProps } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { UserProfile } from "#/entities/userProfile.ts";
import { Message } from "#/entities/chat.ts";
import { chat } from "~/repositories/chat.dao.ts";
import { Button } from "~/components/Button.tsx";
import { logger } from "~/shared/logging.ts";
import { raise } from "~/shared/exceptions.ts";

type Data = {
  userProfile: UserProfile;
  messages: Message[];
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const userProfile = await client.fetchAuthenticatedUser(req);
    const messages = await chat.listMessages();
    const data: Data = { messages, userProfile };

    logger.debug({ data });
    return ctx.render(data);
  },
  async POST(req) {
    const formData = await req.formData();
    const message = formData.get("message")?.toString() ??
      raise("No message found");
    const sender = formData.get("sender")?.toString() ??
      raise("No sender found");

    logger.debug({ message, sender });
    await chat.addMessage({ message, sender });

    return Response.redirect(req.url);
  },
};

export default function Home(props: PageProps<Data>) {
  const { userProfile, messages } = props.data;
  const { username } = userProfile;
  return (
    <AppLayout path={props.url.pathname ?? "/"}>
      <div class="p-4 text-left grid gap-2">
        <h1 class="text-2xl">
          Chat @{username}
        </h1>

        <div class="messages grid gap-2 font-mono bg(gray-300 dark:gray-700) h-24 p-4 rounded overflow-auto">
          {messages.length === 0
            ? <p class="text-center">No message found yet</p>
            : messages.map((m) => (
              <p key={m.id} class={m.sender === username ? "text-bold" : ""}>
                @{m.sender === username ? "me" : username}: {m.message}
              </p>
            ))}
        </div>

        <form method="POST" class="flex">
          <input
            autoFocus
            type="text"
            name="message"
            class="flex-1 py-2 px-4 bg(gray-300 dark:gray-700)"
            placeholder="Enter a new message here"
          />
          <input
            hidden
            type="text"
            name="sender"
            value={username}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </AppLayout>
  );
}
