import { config } from "dotenv";

// load env configs
const envConfig = config()

export const site = {
  name: "TremTec",
  title: "TremTec.labs",
  subTitle: "Welcome to your base `fresh` project",
  description: "TremTec Labs",
  keywords: "TremTec,software,learning,projects",
  repository: "https://github.com/tremtec/labs",
};

export const github = {
  clientId: envConfig.GITHUB_CLIENT_ID,
  clientSecret: envConfig.GITHUB_CLIENT_SECRET,
}

console.log(config());
