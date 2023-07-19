import { z } from "zod";
import { v1 } from "$std/uuid/mod.ts";

export const MessageSchema = z.object({
  id: z.string().uuid(),
  sender: z.string().min(3),
  message: z.string().min(1),
  createdAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

export const MessageInputSchema = MessageSchema.omit({
  id: true,
  createdAt: true,
});
export type MessageInput = z.infer<typeof MessageInputSchema>;

export function createMessage(msg: MessageInput): Message {
  return MessageSchema.parse({
    ...msg,
    id: v1.generate().toString(),
    createdAt: new Date(),
  });
}
