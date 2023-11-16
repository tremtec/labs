import { z } from "zod";
import { v1 } from "$std/uuid/mod.ts";

export const TaskSchema = z.object({
  id: z.string().uuid().default(() => v1.generate().toString()),
  title: z.string().trim().min(1, "Please define a title"),
  description: z.string().trim().default(""),
  notes: z.string().trim().default(""),
  updated_at: z.date().default(() => new Date()),
  created_at: z.date().default(() => new Date()),
});

export type Task = z.infer<typeof TaskSchema>;
