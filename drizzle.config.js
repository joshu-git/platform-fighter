import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./db/schema.js",      // path to your schema
  out: "./drizzle",              // migration output
  dialect: "postgresql",         // required
  dbCredentials: {
    url: process.env.NETLIFY_DATABASE_URL, // must be set in your .env
  },
});