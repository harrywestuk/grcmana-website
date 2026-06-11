import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // 1. Drop FK constraints referencing posts from shared relation tables
  await db.execute(sql`
    ALTER TABLE "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_posts_fk";
    ALTER TABLE "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_posts_fk";
    ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_posts_fk";
    ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_posts_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  `)

  // 2. Drop posts_id indexes from shared relation tables
  await db.execute(sql`
    DROP INDEX IF EXISTS "pages_rels_posts_id_idx";
    DROP INDEX IF EXISTS "_pages_v_rels_posts_id_idx";
    DROP INDEX IF EXISTS "redirects_rels_posts_id_idx";
    DROP INDEX IF EXISTS "search_rels_posts_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  `)

  // 3. Drop posts_id columns from shared relation tables
  await db.execute(sql`
    ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "_pages_v_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id";
  `)

  // 4. Handle menu_items_rels: drop posts_id, add articles_id
  await db.execute(sql`
    ALTER TABLE "menu_items_rels" DROP CONSTRAINT IF EXISTS "menu_items_rels_posts_fk";
    DROP INDEX IF EXISTS "menu_items_rels_posts_id_idx";
    ALTER TABLE "menu_items_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "menu_items_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_articles_fk"
        FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "menu_items_rels_articles_id_idx" ON "menu_items_rels" USING btree ("articles_id");
  `)

  // 5. Drop all posts tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "posts_toc" CASCADE;
    DROP TABLE IF EXISTS "posts_populated_authors" CASCADE;
    DROP TABLE IF EXISTS "posts_rels" CASCADE;
    DROP TABLE IF EXISTS "_posts_v_version_toc" CASCADE;
    DROP TABLE IF EXISTS "_posts_v_version_populated_authors" CASCADE;
    DROP TABLE IF EXISTS "_posts_v_rels" CASCADE;
    DROP TABLE IF EXISTS "_posts_v" CASCADE;
    DROP TABLE IF EXISTS "posts" CASCADE;
  `)

  // 6. Drop posts enum types
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_posts_status";
    DROP TYPE IF EXISTS "public"."enum__posts_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_posts_hero_type";
    DROP TYPE IF EXISTS "public"."enum__posts_v_version_hero_type";
  `)

  // 7. Remove 'posts' from archive block enum — requires full recreate
  await db.execute(sql`
    ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE text;
    ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'articles'::text;
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_archive_relation_to";
    CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('articles');
    ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'articles'::"public"."enum_pages_blocks_archive_relation_to";
    ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE "public"."enum_pages_blocks_archive_relation_to"
      USING "relation_to"::"public"."enum_pages_blocks_archive_relation_to";
  `)

  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE text;
    ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'articles'::text;
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_archive_relation_to";
    CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('articles');
    ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'articles'::"public"."enum__pages_v_blocks_archive_relation_to";
    ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE "public"."enum__pages_v_blocks_archive_relation_to"
      USING "relation_to"::"public"."enum__pages_v_blocks_archive_relation_to";
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Restore posts tables would require re-creating the full Posts collection schema.
  // This migration is intentionally not fully reversible — data has been removed.
  // If rollback is needed, restore from a database snapshot taken before this migration.
  await db.execute(sql`SELECT 1`)
}
