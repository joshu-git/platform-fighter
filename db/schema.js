import { pgTable, serial, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // store hashed password
  verified: boolean("verified").default(false),
  settings: jsonb("settings").default({}), // store user settings as JSON
});

// User currency & character data
export const users_currency = pgTable("users_currency", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(), // foreign key to users.id
  money: integer("money").default(0),
  character_data: jsonb("character_data").default({}),
});

// User stats table
export const users_stats = pgTable("users_stats", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(), // foreign key to users.id
  stats: jsonb("stats").default({}), // store arbitrary stats
});

// User achievements table
export const users_achievements = pgTable("users_achievements", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(), // foreign key to users.id
  achievements: jsonb("achievements").default({}), // e.g., {"first_win": true}
});

// User cosmetics table (skins + emotes)
export const users_cosmetics = pgTable("users_cosmetics", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(), // foreign key to users.id
  skins: jsonb("skins").default({}),   // e.g., {"character1": ["skinA","skinB"]}
  emotes: jsonb("emotes").default({}), // e.g., {"character1": ["emoteA","emoteB"]}
});