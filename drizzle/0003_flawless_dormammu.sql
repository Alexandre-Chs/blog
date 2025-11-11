CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb DEFAULT '{"name":"blogai."}'::jsonb
);
