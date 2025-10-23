import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // store hashed password
  verified: boolean("verified").default(false),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
});