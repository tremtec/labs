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
  { link: "/app/chat", name: "Chat" },
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

const RAW_REPO = "https://raw.githubusercontent.com/tremtec/labs/main";
export const INSTALL_CMD = `#! /bin/bash
# deno does not allow remote config yet: https://github.com/denoland/deno/issues/13488
# deno install --unstable --allow-env -c ${RAW_REPO}/deno.json -f ${RAW_REPO}/cli/tt.ts 

# workaround
cd /tmp/
git clone https://github.com/tremtec/labs.git
cd labs
deno task compile:cli
mv tt $HOME/.local/bin/
rm -rf /tmp/labs/
`;
