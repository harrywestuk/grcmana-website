import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu_items"
    ADD COLUMN IF NOT EXISTS "cta_label" varchar,
    ADD COLUMN IF NOT EXISTS "cta_link_type" "enum_menu_items_link_type" DEFAULT 'custom',
    ADD COLUMN IF NOT EXISTS "cta_url" varchar,
    ADD COLUMN IF NOT EXISTS "cta_new_tab" boolean;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu_items"
    DROP COLUMN IF EXISTS "cta_label",
    DROP COLUMN IF EXISTS "cta_link_type",
    DROP COLUMN IF EXISTS "cta_url",
    DROP COLUMN IF EXISTS "cta_new_tab";
  `)
}
