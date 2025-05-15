-- CreateTable
CREATE TABLE "event_types" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "color_code" VARCHAR(7),
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "description" TEXT,
    "is_all_day" BOOLEAN DEFAULT true,
    "is_recurring" BOOLEAN DEFAULT false,
    "recurrence_pattern" VARCHAR(50),
    "visibility_scope" VARCHAR(50) DEFAULT 'company',
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),
    "event_type_id" INTEGER,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_types" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "holiday_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "description" TEXT,
    "country_code" CHAR(2),
    "region" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),
    "holiday_type_id" INTEGER,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_types" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "color_code" VARCHAR(7),
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "notice_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_urgency_types" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "notice_urgency_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "description" TEXT,
    "urgency_id" INTEGER,
    "target_audience" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),
    "notice_type_id" INTEGER,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holiday_types" ADD CONSTRAINT "holiday_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holiday_types" ADD CONSTRAINT "holiday_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_holiday_type_id_fkey" FOREIGN KEY ("holiday_type_id") REFERENCES "holiday_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice_types" ADD CONSTRAINT "notice_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice_types" ADD CONSTRAINT "notice_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice_urgency_types" ADD CONSTRAINT "notice_urgency_types_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice_urgency_types" ADD CONSTRAINT "notice_urgency_types_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_notice_type_id_fkey" FOREIGN KEY ("notice_type_id") REFERENCES "notice_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_urgency_id_fkey" FOREIGN KEY ("urgency_id") REFERENCES "notice_urgency_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
