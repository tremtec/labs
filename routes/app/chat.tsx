import AppLayout from "~/components/layouts/AppLayout.tsx";

import { Handlers } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { chat } from "~/repositories/chat.dao.ts";
import { Button } from "~/components/Button.tsx";
import { logger } from "~/shared/logging.ts";
import { raise } from "~/shared/exceptions.ts";
import { MessageInputSchema } from "#/entities/chat.ts";
import { dateFormatter } from "~/shared/date.ts";

export const handler: Handlers = {
  async POST(req) {
    const formData = await req.formData();
    const message = formData.get("message")?.toString() ??
      raise("No message found");
    const sender = formData.get("sender")?.toString() ??
      raise("No sender found");

    const input = MessageInputSchema.safeParse({ message, sender });

    if (!input.success) {
      const url = new URL(req.url);
      url.searchParams.set("error", input.error.toString());
      return Response.redirect(url);
    }

    logger.debug({ input });
    await chat.addMessage(input.data);

    return Response.redirect(req.url);
  },
};

export default async function Chat(req: Request) {
  const url = new URL(req.url);
  const { username } = await client.fetchAuthenticatedUser(req);
  const messages = await chat.listMessages();

  return (
    <AppLayout path={url.pathname ?? "/"}>
      <div class="p-4 text-left grid gap-2">
        <h1 class="text-2xl">
          Chat @{username}
        </h1>

        <div class="messages grid gap-2 font-mono bg(gray-300 dark:gray-700) h-24 p-4 rounded overflow-auto">
          {messages.length === 0
            ? <p class="text-center">No message found yet</p>
            : messages.map((m) => (
              <p key={m.id} class={m.sender === username ? "text-bold" : ""}>
                @{m.sender === username ? "me" : m.sender} at{" "}
                {dateFormatter(m.createdAt)}: {m.message}
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
