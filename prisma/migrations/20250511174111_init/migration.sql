-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment_statuses" (
    "id" SERIAL NOT NULL,
    "status_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "employment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_state_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "area_id" INTEGER NOT NULL,
    "designation_id" INTEGER NOT NULL,
    "employment_status_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "user_state_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "manager_id" INTEGER,
    "current_area_id" INTEGER,
    "current_designation_id" INTEGER,
    "current_employment_status_id" INTEGER NOT NULL,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_unique" ON "areas"("name");

-- CreateIndex
CREATE INDEX "idx_areas_name" ON "areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "designations_title_unique" ON "designations"("title");

-- CreateIndex
CREATE INDEX "idx_designations_title" ON "designations"("title");

-- CreateIndex
CREATE UNIQUE INDEX "employment_statuses_status_name_unique" ON "employment_statuses"("status_name");

-- CreateIndex
CREATE INDEX "idx_employment_statuses_status_name" ON "employment_statuses"("status_name");

-- CreateIndex
CREATE INDEX "idx_user_state_history_area_id" ON "user_state_history"("area_id");

-- CreateIndex
CREATE INDEX "idx_user_state_history_designation_id" ON "user_state_history"("designation_id");

-- CreateIndex
CREATE INDEX "idx_user_state_history_employment_status_id" ON "user_state_history"("employment_status_id");

-- CreateIndex
CREATE INDEX "idx_user_state_history_user_id" ON "user_state_history"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_state_history_user_id_end_date" ON "user_state_history"("user_id", "end_date");

-- CreateIndex
CREATE INDEX "idx_user_state_history_user_id_start_date" ON "user_state_history"("user_id", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_current_area_id" ON "users"("current_area_id");

-- CreateIndex
CREATE INDEX "idx_users_current_designation_id" ON "users"("current_designation_id");

-- CreateIndex
CREATE INDEX "idx_users_current_employment_status_id" ON "users"("current_employment_status_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_manager_id" ON "users"("manager_id");

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "employment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_area_id_fkey" FOREIGN KEY ("current_area_id") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_designation_id_fkey" FOREIGN KEY ("current_designation_id") REFERENCES "designations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_employment_status_id_fkey" FOREIGN KEY ("current_employment_status_id") REFERENCES "employment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
