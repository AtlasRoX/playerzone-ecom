CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image" text NOT NULL,
	"category" text DEFAULT 'SHOES' NOT NULL,
	"colors" jsonb DEFAULT '[]' NOT NULL,
	"span" text DEFAULT 'col-span-12 lg:col-span-6' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"details" jsonb DEFAULT '[]' NOT NULL,
	"sizes" jsonb DEFAULT '[]' NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0.0' NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"gallery" jsonb DEFAULT '[]' NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"trending" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "slug" text;
--> statement-breakpoint
-- Backfill: any existing row without a slug gets one derived from its id
UPDATE "products" SET "slug" = 'product-' || replace("id"::text, '-', '') WHERE "slug" IS NULL;
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");
