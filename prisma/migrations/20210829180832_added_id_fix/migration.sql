-- AlterTable
CREATE SEQUENCE "column_id_seq";
ALTER TABLE "Column" ALTER COLUMN "id" SET DEFAULT nextval('column_id_seq');
ALTER SEQUENCE "column_id_seq" OWNED BY "Column"."id";

-- AlterTable
CREATE SEQUENCE "item_id_seq";
ALTER TABLE "Item" ALTER COLUMN "id" SET DEFAULT nextval('item_id_seq');
ALTER SEQUENCE "item_id_seq" OWNED BY "Item"."id";
