import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // 1. Add aioSnippet group columns to articles and _articles_v
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "aio_snippet_heading" varchar;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "aio_snippet_summary" jsonb;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_aio_snippet_heading" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_aio_snippet_summary" jsonb;
  `)

  // 2. Create facts array tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "articles_aio_snippet_facts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "term" varchar,
      "definition" varchar
    );
    CREATE TABLE IF NOT EXISTS "_articles_v_version_aio_snippet_facts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "term" varchar,
      "definition" varchar
    );
  `)

  // 3. Add FK constraints
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "articles_aio_snippet_facts"
        ADD CONSTRAINT "articles_aio_snippet_facts_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "_articles_v_version_aio_snippet_facts"
        ADD CONSTRAINT "_articles_v_version_aio_snippet_facts_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // 4. Create indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "articles_aio_snippet_facts_order_idx"
      ON "articles_aio_snippet_facts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "articles_aio_snippet_facts_parent_id_idx"
      ON "articles_aio_snippet_facts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_aio_snippet_facts_order_idx"
      ON "_articles_v_version_aio_snippet_facts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_aio_snippet_facts_parent_id_idx"
      ON "_articles_v_version_aio_snippet_facts" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "articles_aio_snippet_facts" CASCADE;
    DROP TABLE IF EXISTS "_articles_v_version_aio_snippet_facts" CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "aio_snippet_heading";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "aio_snippet_summary";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_aio_snippet_heading";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_aio_snippet_summary";
  `)
}
