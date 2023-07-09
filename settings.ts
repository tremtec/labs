import { z } from "zod";
import "dotenv";

export const site = {
  name: "TremTec",
  title: "TremTec.labs",
  subTitle: "Welcome to your base `fresh` project",
  description: "TremTec Labs",
  keywords: "TremTec,software,learning,projects",
  repository: "https://github.com/tremtec/labs",
};

export type NavLink = {
  name: string;
  link: string;
  alt?: string;
};

export const privateNavLinks: NavLink[] = [
  { link: "/app", name: "Dashboard" },
  { link: "/app/interviews", name: "Interviews" },
  { link: "/app/profile", name: "Profile" },
];

const VarEnvSchema = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

// validate if var envs are processed
const env = VarEnvSchema.parse(Deno.env.toObject());

export const github = {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  callbackUrl: "/api/auth/github/callback",
  refreshUrl: "/api/auth/github/refresh",
  logoutUrl: "/api/auth/logout",
  signInUrl: "/api/auth/github",
  scope: "read:user" as const,
};
