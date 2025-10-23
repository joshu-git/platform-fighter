import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  // @ts-ignore: TypeScript types don't yet include neon-http
  driver: "neon-http",
  dbCredentials: process.env.NETLIFY_DATABASE_URL! as any, // bypasses type checking
});
