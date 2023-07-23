import {
  createMessage,
  Message,
  MessageInput,
  MessageSchema,
} from "#/entities/chat.ts";
import { raise } from "~/shared/exceptions.ts";
import { kv } from "~/repositories/db.ts";
import { logger } from "~/shared/logging.ts";

class ChatDao {
  private prefixKey = "chat:message";
  private prefixSortedKey = "chat:message:sorted";

  constructor(private db: Deno.Kv) {}

  async addMessage(msg: MessageInput): Promise<Message> {
    const message = createMessage(msg);
    const res = await this.db.atomic()
      .set([this.prefixKey, message.id], message)
      .set([this.prefixSortedKey, message.createdAt.getTime()], message)
      .commit();
    return res.ok ? message : raise("failed to insert");
  }

  async listMessages({ limit = 10, cursor = "" } = {}): Promise<Message[]> {
    const messagesIter = this.db.list(
      { prefix: [this.prefixSortedKey] },
      { reverse: true, limit, cursor },
    );

    const messages: Message[] = [];
    for await (const item of messagesIter) {
      const msg = MessageSchema.safeParse(item.value);
      if (!msg.success) {
        logger.error(msg.error);
        await kv.delete(item.key);
        continue;
      }
      messages.push(msg.data);
    }

    return messages;
  }
}

export const chat = new ChatDao(kv);
