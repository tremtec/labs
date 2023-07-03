import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  avatarUrl: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
