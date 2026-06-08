import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`

   CREATE TYPE "public"."enum_menu_items_link_type" AS ENUM('internal', 'custom');

   CREATE TABLE "menu_items" (
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "description" varchar,
    "link_type" "enum_menu_items_link_type" DEFAULT 'custom',
    "new_tab" boolean,
    "url" varchar,
    "mega_panel" boolean DEFAULT false,
    "order" numeric DEFAULT 0,
    "column" numeric DEFAULT 1,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE TABLE "menu_items_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "pages_id" integer,
    "posts_id" integer,
    "menu_items_id" integer
   );

   ALTER TABLE "header_rels" ADD COLUMN "menu_items_id" integer;
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menu_items_id" integer;

   ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_parent_fk"
    FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_pages_fk"
    FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_posts_fk"
    FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_menu_items_fk"
    FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;

   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_menu_items_fk"
    FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk"
    FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;

   CREATE INDEX "menu_items_rels_order_idx" ON "menu_items_rels" ("order");
   CREATE INDEX "menu_items_rels_parent_idx" ON "menu_items_rels" ("parent_id");
   CREATE INDEX "menu_items_rels_path_idx" ON "menu_items_rels" ("path");
   CREATE INDEX "menu_items_created_at_idx" ON "menu_items" ("created_at");
   CREATE INDEX "menu_items_updated_at_idx" ON "menu_items" ("updated_at");

   ALTER TABLE "header_nav_items" DROP CONSTRAINT IF EXISTS "header_nav_items_parent_id_fk";
   DROP TABLE IF EXISTS "header_nav_items";
   DROP TYPE IF EXISTS "public"."enum_header_nav_items_link_type";

  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
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

   ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;

   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_menu_items_fk";
   ALTER TABLE "header_rels" DROP CONSTRAINT IF EXISTS "header_rels_menu_items_fk";

   DROP TABLE IF EXISTS "menu_items_rels";
   DROP TABLE IF EXISTS "menu_items";

   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "menu_items_id";
   ALTER TABLE "header_rels" DROP COLUMN IF EXISTS "menu_items_id";

   DROP TYPE IF EXISTS "public"."enum_menu_items_link_type";

  `)
}
