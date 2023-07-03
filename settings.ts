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

const VarEnvSchema = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_REDIRECT: z.string(),
});

// validate if var envs are processed
const env = VarEnvSchema.parse(Deno.env.toObject());

export const github = {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  callbackUrl: "/api/auth/github/callback",
  logoutUrl: "/api/auth/logout",
  cookieAuthKey: "GH_AUTH_KEY",
  tokenUri: "https://github.com/login/oauth/access_token",
  scope: "read:user" as const,
};
