import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "menu_items_column_meta" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "column_number" numeric,
    "heading" varchar NOT NULL,
    "sub_text" varchar
   );

   DO $$ BEGIN
    ALTER TABLE "menu_items_column_meta"
     ADD CONSTRAINT "menu_items_column_meta_parent_id_fk"
     FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id")
     ON DELETE cascade ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN NULL;
   END $$;

   CREATE INDEX IF NOT EXISTS "menu_items_column_meta_order_idx"
    ON "menu_items_column_meta" ("_order");
   CREATE INDEX IF NOT EXISTS "menu_items_column_meta_parent_idx"
    ON "menu_items_column_meta" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "menu_items_column_meta";
  `)
}
