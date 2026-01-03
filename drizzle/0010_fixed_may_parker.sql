ALTER TYPE "public"."status" ADD VALUE 'failed';--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "subject" text NOT NULL;