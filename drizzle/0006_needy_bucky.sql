CREATE TYPE "public"."media_role" AS ENUM('thumbnail', 'inline', 'og_image');--> statement-breakpoint
CREATE TABLE "articles_to_medias" (
	"article_id" text NOT NULL,
	"media_id" text NOT NULL,
	"role" "media_role" DEFAULT 'inline' NOT NULL,
	CONSTRAINT "articles_to_medias_article_id_media_id_role_pk" PRIMARY KEY("article_id","media_id","role")
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"mimetype" text NOT NULL,
	"width" integer,
	"height" integer,
	"size" integer NOT NULL,
	"alt" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medias_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "articles_to_medias" ADD CONSTRAINT "articles_to_medias_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_to_medias" ADD CONSTRAINT "articles_to_medias_media_id_medias_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."medias"("id") ON DELETE cascade ON UPDATE no action;