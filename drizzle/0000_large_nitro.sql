CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"verified" boolean DEFAULT false,
	"settings" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievements" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "users_cosmetics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"skins" jsonb DEFAULT '{}'::jsonb,
	"emotes" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "users_currency" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"money" integer DEFAULT 0,
	"character_data" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "users_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"stats" jsonb DEFAULT '{}'::jsonb
);
