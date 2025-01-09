import { Redis } from "@upstash/redis";

import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env",
});

const client = new Redis({
  url: "https://emerging-quail-33971.upstash.io",
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export default client;
