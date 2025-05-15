/*
  Warnings:

  - You are about to drop the column `event_type_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `holiday_type_id` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `notice_type_id` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `urgency_id` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the `event_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `holiday_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notice_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notice_urgency_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_types" DROP CONSTRAINT "event_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "event_types" DROP CONSTRAINT "event_types_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_event_type_id_fkey";

-- DropForeignKey
ALTER TABLE "holiday_types" DROP CONSTRAINT "holiday_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "holiday_types" DROP CONSTRAINT "holiday_types_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "holidays" DROP CONSTRAINT "holidays_holiday_type_id_fkey";

-- DropForeignKey
ALTER TABLE "notice_types" DROP CONSTRAINT "notice_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "notice_types" DROP CONSTRAINT "notice_types_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "notice_urgency_types" DROP CONSTRAINT "notice_urgency_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "notice_urgency_types" DROP CONSTRAINT "notice_urgency_types_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "notices" DROP CONSTRAINT "notices_notice_type_id_fkey";

-- DropForeignKey
ALTER TABLE "notices" DROP CONSTRAINT "notices_urgency_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "event_type_id",
ADD COLUMN     "event_type_code" VARCHAR(50);

-- AlterTable
ALTER TABLE "holidays" DROP COLUMN "holiday_type_id",
ADD COLUMN     "holiday_type_code" VARCHAR(50);

-- AlterTable
ALTER TABLE "notices" DROP COLUMN "notice_type_id",
DROP COLUMN "urgency_id",
ADD COLUMN     "notice_type_code" VARCHAR(50),
ADD COLUMN     "urgency_type_code" VARCHAR(50);

-- DropTable
DROP TABLE "event_types";

-- DropTable
DROP TABLE "holiday_types";

-- DropTable
DROP TABLE "notice_types";

-- DropTable
DROP TABLE "notice_urgency_types";

-- CreateTable
CREATE TABLE "master_data" (
    "id" SERIAL NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "color" VARCHAR(20),
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "master_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_data_code_key" ON "master_data"("code");

-- CreateIndex
CREATE INDEX "idx_master_data_entity_type" ON "master_data"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "idx_master_data_entity_type_code" ON "master_data"("entity_type", "code");
