import "dotenv";

export const site = {
  name: "TremTec",
  title: "TremTec.labs",
  subTitle: "Welcome to your base `fresh` project",
  description: "TremTec Labs",
  keywords: "TremTec,software,learning,projects",
  repository: "https://github.com/tremtec/labs",
};

export const github = {
  clientId: Deno.env.get("GITHUB_CLIENT_ID") ?? "",
  clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET") ?? "",
};
