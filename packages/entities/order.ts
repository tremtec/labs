import { z } from "zod";
import { v1 } from "$std/uuid/mod.ts";

export const OrderItemSchema = z.object({
  id: z.string().uuid().default(() => v1.generate().toString()),

  name: z.string().trim().min(1, "Please define a title"),
  quantity: z.string().trim().default(""),

  created_at: z.date().default(() => new Date()),
});

export const OrderSchema = z.object({
  id: z.string().uuid().default(() => v1.generate().toString()),
  author_id: z.number(),

  title: z.string().trim().min(1, "Please define a title"),
  description: z.string().trim().default(""),

  updated_at: z.date().default(() => new Date()),
  created_at: z.date().default(() => new Date()),
});
