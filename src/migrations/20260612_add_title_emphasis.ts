import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "title_emphasis" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_title_emphasis" varchar;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "title_emphasis";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_title_emphasis";
  `)
}
