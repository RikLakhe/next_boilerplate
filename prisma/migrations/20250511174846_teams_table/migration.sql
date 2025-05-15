-- CreateTable
CREATE TABLE "team_allocations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "role_in_team" VARCHAR(100),
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "allocation_percentage" DECIMAL(5,2) DEFAULT 100.00,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "team_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "lead_user_id" INTEGER,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_team_allocations_team_id" ON "team_allocations"("team_id");

-- CreateIndex
CREATE INDEX "idx_team_allocations_user_id" ON "team_allocations"("user_id");

-- CreateIndex
CREATE INDEX "idx_team_allocations_user_id_team_id_start_date" ON "team_allocations"("user_id", "team_id", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_unique" ON "teams"("name");

-- CreateIndex
CREATE INDEX "idx_teams_lead_user_id" ON "teams"("lead_user_id");

-- CreateIndex
CREATE INDEX "idx_teams_name" ON "teams"("name");

-- AddForeignKey
ALTER TABLE "team_allocations" ADD CONSTRAINT "team_allocations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocations" ADD CONSTRAINT "team_allocations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocations" ADD CONSTRAINT "team_allocations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocations" ADD CONSTRAINT "team_allocations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_lead_user_id_fkey" FOREIGN KEY ("lead_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
