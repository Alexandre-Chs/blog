CREATE TYPE "public"."device" AS ENUM('desktop', 'mobile', 'tablet');--> statement-breakpoint
CREATE TABLE "visits" (
	"id" text PRIMARY KEY NOT NULL,
	"started_at" timestamp NOT NULL,
	"last_seen_at" timestamp NOT NULL,
	"pages" text[] DEFAULT '{}' NOT NULL,
	"page_views" integer DEFAULT 0 NOT NULL,
	"entry_page" text NOT NULL,
	"exit_page" text NOT NULL,
	"referrer" text,
	"country" text,
	"browser" text,
	"duration" integer,
	"device" "device",
	"created_at" timestamp DEFAULT now() NOT NULL
);
