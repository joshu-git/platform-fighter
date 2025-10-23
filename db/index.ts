import * as dotenv from "dotenv";
dotenv.config();

import { neon } from "@netlify/neon";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const db = drizzle({
  client: neon(process.env.NETLIFY_DATABASE_URL!),
  schema,
});

