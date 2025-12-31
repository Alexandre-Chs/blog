CREATE TYPE "public"."status" AS ENUM('draft', 'generating', 'published');--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"context" text NOT NULL,
	"position" integer,
	"status" "status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
