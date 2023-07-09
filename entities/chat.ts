import { z } from "zod";
import { v1 } from "$std/uuid/mod.ts";

export const MessageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  message: z.string(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

export type MessageInput = Omit<Message, "id" | "createdAt">;

export function createMessage(msg: MessageInput): Message {
  return MessageSchema.parse({
    ...msg,
    id: v1.generate().toString(),
    createdAt: new Date(),
  });
}
