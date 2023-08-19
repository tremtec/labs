import { defineRoute, Handlers } from "$fresh/server.ts";
import { client } from "~/services/github.ts";
import { chat } from "~/repositories/chat.dao.ts";
import { Button } from "~/components/Button.tsx";
import { logger } from "~/shared/logging.ts";
import { raise } from "~/shared/exceptions.ts";
import { Message, MessageInputSchema } from "#/entities/chat.ts";
import { dateFormatter } from "~/shared/date.ts";
import { textToRGB } from "~/shared/text.ts";

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

export default defineRoute(async (req) => {
  const { username } = await client.fetchAuthenticatedUser(req);
  const messages = await chat.listMessages();

  return (
    <>
      <div class="p-4 text-left grid gap-2 max-h-[calc(100vh-15rem)]">
        <h1 class="text-2xl">
          Chat @{username}
        </h1>

        <div class="messages grid gap-2 flex-1 font-mono bg(gray-300 dark:gray-700) p-4 rounded overflow-auto">
          {messages.length === 0
            ? <p class="text-center">No message found yet</p>
            : messages.map((m) => <MessageDisplay m={m} username={username} />)}
        </div>

        <form method="POST" class="flex ">
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

          <Button type="submit" class="border-0 bg(gray-300 dark:gray-700)">
            Send
          </Button>
        </form>
      </div>
    </>
  );
});

type MessageDisplayProps = {
  m: Message;
  username: string;
};

function MessageDisplay({ m, username }: MessageDisplayProps) {
  const user = m.sender === username ? "me" : m.sender;
  const date = dateFormatter(m.createdAt);
  const color = textToRGB(username);
  const usernameStyle = `text-[rgb(${color})] px-1 text-xs`;
  return (
    <p
      key={m.id}
      class={`${m.sender === username ? "text-bold" : ""} flex flex-row gap-1`}
    >
      <p class={usernameStyle}>
        @{user} <span>- {date}</span>
      </p>
      <p>{m.message}</p>
    </p>
  );
}
