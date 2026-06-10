import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Authors enums — always new
  await db.execute(sql`
    CREATE TYPE "public"."enum_authors_credentials_verification_platform" AS ENUM('credly', 'issuer', 'other');
    CREATE TYPE "public"."enum_authors_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__authors_v_version_credentials_verification_platform" AS ENUM('credly', 'issuer', 'other');
    CREATE TYPE "public"."enum__authors_v_version_status" AS ENUM('draft', 'published');
  `)

  // MenuItems enums — may already exist from dev-mode push
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_menu_items_link_type" AS ENUM('internal', 'custom');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_menu_items_cta_link_type" AS ENUM('internal', 'custom');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Authors tables — always new
  await db.execute(sql`
    CREATE TABLE "authors_credentials" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"title" varchar,
    	"issuer" varchar,
    	"year" numeric,
    	"verification_url" varchar,
    	"verification_platform" "enum_authors_credentials_verification_platform"
    );
    CREATE TABLE "authors_expertise" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"label" varchar
    );
    CREATE TABLE "authors_organisations" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"name" varchar,
    	"role" varchar,
    	"url" varchar
    );
    CREATE TABLE "authors" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"name" varchar,
    	"role" varchar,
    	"avatar_id" integer,
    	"bio" varchar,
    	"bio_extended" jsonb,
    	"years_experience" numeric,
    	"website" varchar,
    	"linked_in" varchar,
    	"twitter" varchar,
    	"github" varchar,
    	"youtube" varchar,
    	"medium" varchar,
    	"facebook" varchar,
    	"instagram" varchar,
    	"pinterest" varchar,
    	"tiktok" varchar,
    	"meta_title" varchar,
    	"meta_image_id" integer,
    	"meta_description" varchar,
    	"generate_slug" boolean DEFAULT true,
    	"slug" varchar,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"_status" "enum_authors_status" DEFAULT 'draft'
    );
    CREATE TABLE "_authors_v_version_credentials" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"title" varchar,
    	"issuer" varchar,
    	"year" numeric,
    	"verification_url" varchar,
    	"verification_platform" "enum__authors_v_version_credentials_verification_platform",
    	"_uuid" varchar
    );
    CREATE TABLE "_authors_v_version_expertise" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"label" varchar,
    	"_uuid" varchar
    );
    CREATE TABLE "_authors_v_version_organisations" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"name" varchar,
    	"role" varchar,
    	"url" varchar,
    	"_uuid" varchar
    );
    CREATE TABLE "_authors_v" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"parent_id" integer,
    	"version_name" varchar,
    	"version_role" varchar,
    	"version_avatar_id" integer,
    	"version_bio" varchar,
    	"version_bio_extended" jsonb,
    	"version_years_experience" numeric,
    	"version_website" varchar,
    	"version_linked_in" varchar,
    	"version_twitter" varchar,
    	"version_github" varchar,
    	"version_youtube" varchar,
    	"version_medium" varchar,
    	"version_facebook" varchar,
    	"version_instagram" varchar,
    	"version_pinterest" varchar,
    	"version_tiktok" varchar,
    	"version_meta_title" varchar,
    	"version_meta_image_id" integer,
    	"version_meta_description" varchar,
    	"version_generate_slug" boolean DEFAULT true,
    	"version_slug" varchar,
    	"version_updated_at" timestamp(3) with time zone,
    	"version_created_at" timestamp(3) with time zone,
    	"version__status" "enum__authors_v_version_status" DEFAULT 'draft',
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"latest" boolean,
    	"autosave" boolean
    );
  `)

  // MenuItems tables — may already exist from dev-mode push
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "menu_items_column_meta" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"column_number" numeric,
    	"heading" varchar,
    	"sub_text" varchar
    );
    CREATE TABLE IF NOT EXISTS "menu_items" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"label" varchar NOT NULL,
    	"description" varchar,
    	"link_type" "enum_menu_items_link_type" DEFAULT 'custom',
    	"new_tab" boolean,
    	"url" varchar,
    	"mega_panel" boolean DEFAULT false,
    	"cta_label" varchar,
    	"cta_link_type" "enum_menu_items_cta_link_type" DEFAULT 'custom',
    	"cta_new_tab" boolean,
    	"cta_url" varchar,
    	"parent_id" integer,
    	"order" numeric DEFAULT 0,
    	"column" numeric DEFAULT 1,
    	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "menu_items_rels" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"order" integer,
    	"parent_id" integer NOT NULL,
    	"path" varchar NOT NULL,
    	"pages_id" integer,
    	"posts_id" integer
    );
  `)

  // Drop header_nav_items — may already be gone from dev-mode push
  await db.execute(sql`DROP TABLE IF EXISTS "header_nav_items" CASCADE;`)

  // Add columns — IF NOT EXISTS guards menu_items_id which may already exist
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "authors_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "menu_items_id" integer;
    ALTER TABLE "header_rels" ADD COLUMN IF NOT EXISTS "menu_items_id" integer;
  `)

  // Authors FK constraints — always new
  await db.execute(sql`
    ALTER TABLE "authors_credentials" ADD CONSTRAINT "authors_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "authors_expertise" ADD CONSTRAINT "authors_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "authors_organisations" ADD CONSTRAINT "authors_organisations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "authors" ADD CONSTRAINT "authors_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_authors_v_version_credentials" ADD CONSTRAINT "_authors_v_version_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_authors_v_version_expertise" ADD CONSTRAINT "_authors_v_version_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_authors_v_version_organisations" ADD CONSTRAINT "_authors_v_version_organisations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_authors_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_parent_id_authors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_authors_v" ADD CONSTRAINT "_authors_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  `)

  // MenuItems FK constraints — may already exist from dev-mode push
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "menu_items_column_meta" ADD CONSTRAINT "menu_items_column_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parent_id_menu_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Authors indexes — always new
  await db.execute(sql`
    CREATE INDEX "authors_credentials_order_idx" ON "authors_credentials" USING btree ("_order");
    CREATE INDEX "authors_credentials_parent_id_idx" ON "authors_credentials" USING btree ("_parent_id");
    CREATE INDEX "authors_expertise_order_idx" ON "authors_expertise" USING btree ("_order");
    CREATE INDEX "authors_expertise_parent_id_idx" ON "authors_expertise" USING btree ("_parent_id");
    CREATE INDEX "authors_organisations_order_idx" ON "authors_organisations" USING btree ("_order");
    CREATE INDEX "authors_organisations_parent_id_idx" ON "authors_organisations" USING btree ("_parent_id");
    CREATE INDEX "authors_avatar_idx" ON "authors" USING btree ("avatar_id");
    CREATE INDEX "authors_meta_meta_image_idx" ON "authors" USING btree ("meta_image_id");
    CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
    CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
    CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
    CREATE INDEX "authors__status_idx" ON "authors" USING btree ("_status");
    CREATE INDEX "_authors_v_version_credentials_order_idx" ON "_authors_v_version_credentials" USING btree ("_order");
    CREATE INDEX "_authors_v_version_credentials_parent_id_idx" ON "_authors_v_version_credentials" USING btree ("_parent_id");
    CREATE INDEX "_authors_v_version_expertise_order_idx" ON "_authors_v_version_expertise" USING btree ("_order");
    CREATE INDEX "_authors_v_version_expertise_parent_id_idx" ON "_authors_v_version_expertise" USING btree ("_parent_id");
    CREATE INDEX "_authors_v_version_organisations_order_idx" ON "_authors_v_version_organisations" USING btree ("_order");
    CREATE INDEX "_authors_v_version_organisations_parent_id_idx" ON "_authors_v_version_organisations" USING btree ("_parent_id");
    CREATE INDEX "_authors_v_parent_idx" ON "_authors_v" USING btree ("parent_id");
    CREATE INDEX "_authors_v_version_version_avatar_idx" ON "_authors_v" USING btree ("version_avatar_id");
    CREATE INDEX "_authors_v_version_meta_version_meta_image_idx" ON "_authors_v" USING btree ("version_meta_image_id");
    CREATE INDEX "_authors_v_version_version_slug_idx" ON "_authors_v" USING btree ("version_slug");
    CREATE INDEX "_authors_v_version_version_updated_at_idx" ON "_authors_v" USING btree ("version_updated_at");
    CREATE INDEX "_authors_v_version_version_created_at_idx" ON "_authors_v" USING btree ("version_created_at");
    CREATE INDEX "_authors_v_version_version__status_idx" ON "_authors_v" USING btree ("version__status");
    CREATE INDEX "_authors_v_created_at_idx" ON "_authors_v" USING btree ("created_at");
    CREATE INDEX "_authors_v_updated_at_idx" ON "_authors_v" USING btree ("updated_at");
    CREATE INDEX "_authors_v_latest_idx" ON "_authors_v" USING btree ("latest");
    CREATE INDEX "_authors_v_autosave_idx" ON "_authors_v" USING btree ("autosave");
  `)

  // MenuItems indexes — may already exist from dev-mode push
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "menu_items_column_meta_order_idx" ON "menu_items_column_meta" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "menu_items_column_meta_parent_id_idx" ON "menu_items_column_meta" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "menu_items_parent_idx" ON "menu_items" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "menu_items_updated_at_idx" ON "menu_items" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "menu_items_created_at_idx" ON "menu_items" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "menu_items_rels_order_idx" ON "menu_items_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "menu_items_rels_parent_idx" ON "menu_items_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "menu_items_rels_path_idx" ON "menu_items_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "menu_items_rels_pages_id_idx" ON "menu_items_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "menu_items_rels_posts_id_idx" ON "menu_items_rels" USING btree ("posts_id");
  `)

  // payload_locked_documents_rels constraints and indexes
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  `)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN
      ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
    CREATE INDEX IF NOT EXISTS "header_rels_menu_items_id_idx" ON "header_rels" USING btree ("menu_items_id");
  `)

  // Drop old enum — may already be gone from dev-mode push
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_header_nav_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );

  ALTER TABLE "authors_credentials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_expertise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors_organisations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_credentials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_expertise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v_version_organisations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_authors_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items_column_meta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "authors_credentials" CASCADE;
  DROP TABLE "authors_expertise" CASCADE;
  DROP TABLE "authors_organisations" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "_authors_v_version_credentials" CASCADE;
  DROP TABLE "_authors_v_version_expertise" CASCADE;
  DROP TABLE "_authors_v_version_organisations" CASCADE;
  DROP TABLE "_authors_v" CASCADE;
  DROP TABLE "menu_items_column_meta" CASCADE;
  DROP TABLE "menu_items" CASCADE;
  DROP TABLE "menu_items_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_authors_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_menu_items_fk";

  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_menu_items_fk";

  DROP INDEX "payload_locked_documents_rels_authors_id_idx";
  DROP INDEX "payload_locked_documents_rels_menu_items_id_idx";
  DROP INDEX "header_rels_menu_items_id_idx";
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "authors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menu_items_id";
  ALTER TABLE "header_rels" DROP COLUMN "menu_items_id";
  DROP TYPE "public"."enum_authors_credentials_verification_platform";
  DROP TYPE "public"."enum_authors_status";
  DROP TYPE "public"."enum__authors_v_version_credentials_verification_platform";
  DROP TYPE "public"."enum__authors_v_version_status";
  DROP TYPE "public"."enum_menu_items_link_type";
  DROP TYPE "public"."enum_menu_items_cta_link_type";`)
}
