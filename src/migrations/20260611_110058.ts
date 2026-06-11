import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // 1. Create enum types — idempotent
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_articles_toc_level" AS ENUM('h2', 'h3');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_articles_hero_style" AS ENUM('image', 'gradient', 'minimal');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_version_toc_level" AS ENUM('h2', 'h3');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_version_hero_style" AS ENUM('image', 'gradient', 'minimal');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 2. Add enum values — idempotent
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
          AND t.typname = 'enum_pages_blocks_archive_relation_to'
          AND e.enumlabel = 'articles'
      ) THEN
        ALTER TYPE "public"."enum_pages_blocks_archive_relation_to" ADD VALUE 'articles' BEFORE 'posts';
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
          AND t.typname = 'enum__pages_v_blocks_archive_relation_to'
          AND e.enumlabel = 'articles'
      ) THEN
        ALTER TYPE "public"."enum__pages_v_blocks_archive_relation_to" ADD VALUE 'articles' BEFORE 'posts';
      END IF;
    END $$;
  `)

  // 3. Create tables — idempotent
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "articles_toc" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar,
      "anchor" varchar,
      "level" "enum_articles_toc_level"
    );
    CREATE TABLE IF NOT EXISTS "articles_populated_authors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar,
      "avatar_id" integer,
      "bio" varchar,
      "linked_in" varchar
    );
    CREATE TABLE IF NOT EXISTS "articles" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "hero_image_id" integer,
      "hero_image_alt" varchar,
      "hero_style" "enum_articles_hero_style",
      "content" jsonb,
      "read_time" numeric,
      "meta_title" varchar,
      "meta_image_id" integer,
      "meta_description" varchar,
      "excerpt" varchar,
      "published_at" timestamp(3) with time zone,
      "featured" boolean,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_articles_status" DEFAULT 'draft'
    );
    CREATE TABLE IF NOT EXISTS "articles_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "articles_id" integer,
      "categories_id" integer,
      "authors_id" integer
    );
    CREATE TABLE IF NOT EXISTS "_articles_v_version_toc" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "anchor" varchar,
      "level" "enum__articles_v_version_toc_level",
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_articles_v_version_populated_authors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "name" varchar,
      "avatar_id" integer,
      "bio" varchar,
      "linked_in" varchar
    );
    CREATE TABLE IF NOT EXISTS "_articles_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_hero_image_id" integer,
      "version_hero_image_alt" varchar,
      "version_hero_style" "enum__articles_v_version_hero_style",
      "version_content" jsonb,
      "version_read_time" numeric,
      "version_meta_title" varchar,
      "version_meta_image_id" integer,
      "version_meta_description" varchar,
      "version_excerpt" varchar,
      "version_published_at" timestamp(3) with time zone,
      "version_featured" boolean,
      "version_generate_slug" boolean DEFAULT true,
      "version_slug" varchar,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__articles_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );
    CREATE TABLE IF NOT EXISTS "_articles_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "articles_id" integer,
      "categories_id" integer,
      "authors_id" integer
    );
  `)

  // 4. Add columns to existing tables — idempotent
  await db.execute(sql`
    ALTER TABLE "pages_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
    ALTER TABLE "_pages_v_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
    ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
    ALTER TABLE "search_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
  `)

  // 5. Add foreign key constraints — idempotent
  await db.execute(sql`
    DO $$ BEGIN ALTER TABLE "articles_toc" ADD CONSTRAINT "articles_toc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles_populated_authors" ADD CONSTRAINT "articles_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles_populated_authors" ADD CONSTRAINT "articles_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_version_toc" ADD CONSTRAINT "_articles_v_version_toc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_version_populated_authors" ADD CONSTRAINT "_articles_v_version_populated_authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_version_populated_authors" ADD CONSTRAINT "_articles_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 6. Create indexes — idempotent
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "articles_toc_order_idx" ON "articles_toc" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "articles_toc_parent_id_idx" ON "articles_toc" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "articles_populated_authors_order_idx" ON "articles_populated_authors" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "articles_populated_authors_parent_id_idx" ON "articles_populated_authors" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "articles_populated_authors_avatar_idx" ON "articles_populated_authors" USING btree ("avatar_id");
    CREATE INDEX IF NOT EXISTS "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_idx" ON "articles" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "articles_created_at_idx" ON "articles" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "articles__status_idx" ON "articles" USING btree ("_status");
    CREATE INDEX IF NOT EXISTS "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
    CREATE INDEX IF NOT EXISTS "articles_rels_categories_id_idx" ON "articles_rels" USING btree ("categories_id");
    CREATE INDEX IF NOT EXISTS "articles_rels_authors_id_idx" ON "articles_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_toc_order_idx" ON "_articles_v_version_toc" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_toc_parent_id_idx" ON "_articles_v_version_toc" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_populated_authors_order_idx" ON "_articles_v_version_populated_authors" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_populated_authors_parent_id_idx" ON "_articles_v_version_populated_authors" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_populated_authors_avatar_idx" ON "_articles_v_version_populated_authors" USING btree ("avatar_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
    CREATE INDEX IF NOT EXISTS "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_rels_categories_id_idx" ON "_articles_v_rels" USING btree ("categories_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_rels_authors_id_idx" ON "_articles_v_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "pages_rels_articles_id_idx" ON "pages_rels" USING btree ("articles_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_articles_id_idx" ON "_pages_v_rels" USING btree ("articles_id");
    CREATE INDEX IF NOT EXISTS "redirects_rels_articles_id_idx" ON "redirects_rels" USING btree ("articles_id");
    CREATE INDEX IF NOT EXISTS "search_rels_articles_id_idx" ON "search_rels" USING btree ("articles_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles_toc" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_toc" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_articles_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articles_toc" CASCADE;
  DROP TABLE "articles_populated_authors" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_toc" CASCADE;
  DROP TABLE "_articles_v_version_populated_authors" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_articles_fk";

  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_articles_fk";

  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_articles_fk";

  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_articles_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_articles_fk";

  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::text;
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::"public"."enum_pages_blocks_archive_relation_to";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE "public"."enum_pages_blocks_archive_relation_to" USING "relation_to"::"public"."enum_pages_blocks_archive_relation_to";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::text;
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::"public"."enum__pages_v_blocks_archive_relation_to";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE "public"."enum__pages_v_blocks_archive_relation_to" USING "relation_to"::"public"."enum__pages_v_blocks_archive_relation_to";
  DROP INDEX "pages_rels_articles_id_idx";
  DROP INDEX "_pages_v_rels_articles_id_idx";
  DROP INDEX "redirects_rels_articles_id_idx";
  DROP INDEX "search_rels_articles_id_idx";
  DROP INDEX "payload_locked_documents_rels_articles_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "articles_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "articles_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "articles_id";
  ALTER TABLE "search_rels" DROP COLUMN "articles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "articles_id";
  DROP TYPE "public"."enum_articles_toc_level";
  DROP TYPE "public"."enum_articles_hero_style";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_toc_level";
  DROP TYPE "public"."enum__articles_v_version_hero_style";
  DROP TYPE "public"."enum__articles_v_version_status";`)
}
