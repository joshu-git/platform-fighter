import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./db/schema.js",
  out: "./drizzle",
  driver: "neon-http",
  dbCredentials: process.env.NETLIFY_DATABASE_URL,
});