import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // header_rels: drop posts_id, add articles_id
  await db.execute(sql`
    ALTER TABLE "header_rels" DROP CONSTRAINT IF EXISTS "header_rels_posts_fk";
    DROP INDEX IF EXISTS "header_rels_posts_id_idx";
    ALTER TABLE "header_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "header_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_articles_fk"
        FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "header_rels_articles_id_idx" ON "header_rels" USING btree ("articles_id");
  `)

  // footer_rels: drop posts_id, add articles_id
  await db.execute(sql`
    ALTER TABLE "footer_rels" DROP CONSTRAINT IF EXISTS "footer_rels_posts_fk";
    DROP INDEX IF EXISTS "footer_rels_posts_id_idx";
    ALTER TABLE "footer_rels" DROP COLUMN IF EXISTS "posts_id";
    ALTER TABLE "footer_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_articles_fk"
        FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "footer_rels_articles_id_idx" ON "footer_rels" USING btree ("articles_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1`)
}
