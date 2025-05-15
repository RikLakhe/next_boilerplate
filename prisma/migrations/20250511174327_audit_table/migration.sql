-- CreateEnum
CREATE TYPE "requesttype" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'OTHER');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "entity" VARCHAR(255),
    "old_value" JSON,
    "new_value" JSON,
    "request_type" "requesttype",
    "requested_by" INTEGER,
    "requested_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "responded_by" INTEGER,
    "responded_on" TIMESTAMPTZ(6),

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_responded_by_fkey" FOREIGN KEY ("responded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
