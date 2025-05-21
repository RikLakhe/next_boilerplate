-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'OTHER');

-- CreateTable
CREATE TABLE "area" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "entity" VARCHAR(255) NOT NULL,
    "old_value" JSON,
    "new_value" JSON,
    "request_type" "RequestType",
    "requested_by" INTEGER,
    "requested_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "responded_by" INTEGER,
    "responded_on" TIMESTAMPTZ(6),

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designation" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment_status" (
    "id" SERIAL NOT NULL,
    "status_name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "employment_status_pkey" PRIMARY KEY ("id")
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
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
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

-- CreateTable
CREATE TABLE "team_allocation" (
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

    CONSTRAINT "team_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "lead_user_id" INTEGER,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "is_all_day" BOOLEAN DEFAULT false,
    "is_recurring" BOOLEAN DEFAULT false,
    "recurrence_pattern" VARCHAR(50),
    "visibility_scope" VARCHAR(50) DEFAULT 'company',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),
    "event_type_code" VARCHAR(50),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday" (
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
    "holiday_type_code" VARCHAR(50),

    CONSTRAINT "holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "description" TEXT,
    "target_audience" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),
    "notice_type_code" VARCHAR(50),
    "urgency_type_code" VARCHAR(50),

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "department_user" (
    "department_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR,

    CONSTRAINT "department_user_pkey" PRIMARY KEY ("department_id","user_id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "department_name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "department_manager_id" INTEGER,
    "created_by" INTEGER,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMP(6),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_year" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "fiscal_year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "days" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "carry_over_days" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "leave_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    "fiscal_year_id" INTEGER NOT NULL,
    "total_days" DECIMAL(5,2) NOT NULL,
    "used_days" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "leave_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    "fiscal_year_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "duration_days" DECIMAL(5,2) NOT NULL,
    "reason" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" INTEGER,
    "approved_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "manager_id" INTEGER,
    "created_by" INTEGER,
    "created_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_on" TIMESTAMPTZ(6),

    CONSTRAINT "leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_transaction" (
    "id" SERIAL NOT NULL,
    "leave_id" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'request',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "leave_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_unique" ON "area"("name");

-- CreateIndex
CREATE INDEX "idx_areas_name" ON "area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "designations_title_unique" ON "designation"("title");

-- CreateIndex
CREATE INDEX "idx_designations_title" ON "designation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "employment_statuses_status_name_unique" ON "employment_status"("status_name");

-- CreateIndex
CREATE INDEX "idx_employment_statuses_status_name" ON "employment_status"("status_name");

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

-- CreateIndex
CREATE INDEX "idx_team_allocations_team_id" ON "team_allocation"("team_id");

-- CreateIndex
CREATE INDEX "idx_team_allocations_user_id" ON "team_allocation"("user_id");

-- CreateIndex
CREATE INDEX "idx_team_allocations_user_id_team_id_start_date" ON "team_allocation"("user_id", "team_id", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_unique" ON "team"("name");

-- CreateIndex
CREATE INDEX "idx_teams_lead_user_id" ON "team"("lead_user_id");

-- CreateIndex
CREATE INDEX "idx_teams_name" ON "team"("name");

-- CreateIndex
CREATE INDEX "idx_event_type_code" ON "event"("event_type_code");

-- CreateIndex
CREATE INDEX "idx_holiday_type_code" ON "holiday"("holiday_type_code");

-- CreateIndex
CREATE INDEX "idx_notice_type_code" ON "notice"("notice_type_code");

-- CreateIndex
CREATE INDEX "idx_urgency_type_code" ON "notice"("urgency_type_code");

-- CreateIndex
CREATE UNIQUE INDEX "master_data_code_key" ON "master_data"("code");

-- CreateIndex
CREATE INDEX "idx_master_data_entity_type" ON "master_data"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "idx_master_data_entity_type_code" ON "master_data"("entity_type", "code");

-- CreateIndex
CREATE UNIQUE INDEX "department_department_name_key" ON "department"("department_name");

-- CreateIndex
CREATE INDEX "department_department_manager_id_idx" ON "department"("department_manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_year_name_key" ON "fiscal_year"("name");

-- CreateIndex
CREATE INDEX "idx_fiscal_years_name" ON "fiscal_year"("name");

-- CreateIndex
CREATE INDEX "idx_fiscal_years_start_date" ON "fiscal_year"("start_date");

-- CreateIndex
CREATE INDEX "idx_fiscal_years_end_date" ON "fiscal_year"("end_date");

-- CreateIndex
CREATE UNIQUE INDEX "leave_type_name_key" ON "leave_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "leave_type_code_key" ON "leave_type"("code");

-- CreateIndex
CREATE INDEX "idx_leave_types_name" ON "leave_type"("name");

-- CreateIndex
CREATE INDEX "idx_leave_types_code" ON "leave_type"("code");

-- CreateIndex
CREATE INDEX "idx_leave_balances_user_id" ON "leave_balance"("user_id");

-- CreateIndex
CREATE INDEX "idx_leave_balances_leave_type_id" ON "leave_balance"("leave_type_id");

-- CreateIndex
CREATE INDEX "idx_leave_balances_fiscal_year_id" ON "leave_balance"("fiscal_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_leave_balances_user_leave_fiscal" ON "leave_balance"("user_id", "leave_type_id", "fiscal_year_id");

-- CreateIndex
CREATE INDEX "idx_leaves_user_id" ON "leave"("user_id");

-- CreateIndex
CREATE INDEX "idx_leaves_leave_type_id" ON "leave"("leave_type_id");

-- CreateIndex
CREATE INDEX "idx_leaves_fiscal_year_id" ON "leave"("fiscal_year_id");

-- CreateIndex
CREATE INDEX "idx_leaves_status" ON "leave"("status");

-- CreateIndex
CREATE INDEX "idx_leaves_approved_by" ON "leave"("approved_by");

-- CreateIndex
CREATE INDEX "idx_leaves_manager_id" ON "leave"("manager_id");

-- CreateIndex
CREATE INDEX "idx_leave_transactions_leave_id" ON "leave_transaction"("leave_id");

-- CreateIndex
CREATE INDEX "idx_leave_transactions_type" ON "leave_transaction"("type");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_responded_by_fkey" FOREIGN KEY ("responded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "employment_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_state_history" ADD CONSTRAINT "user_state_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_area_id_fkey" FOREIGN KEY ("current_area_id") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_designation_id_fkey" FOREIGN KEY ("current_designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_employment_status_id_fkey" FOREIGN KEY ("current_employment_status_id") REFERENCES "employment_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocation" ADD CONSTRAINT "team_allocation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocation" ADD CONSTRAINT "team_allocation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocation" ADD CONSTRAINT "team_allocation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team_allocation" ADD CONSTRAINT "team_allocation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_lead_user_id_fkey" FOREIGN KEY ("lead_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_event_type_code_fkey" FOREIGN KEY ("event_type_code") REFERENCES "master_data"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holiday" ADD CONSTRAINT "holiday_holiday_type_code_fkey" FOREIGN KEY ("holiday_type_code") REFERENCES "master_data"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holiday" ADD CONSTRAINT "holiday_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "holiday" ADD CONSTRAINT "holiday_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_notice_type_code_fkey" FOREIGN KEY ("notice_type_code") REFERENCES "master_data"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_urgency_type_code_fkey" FOREIGN KEY ("urgency_type_code") REFERENCES "master_data"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department_user" ADD CONSTRAINT "department_user_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department_user" ADD CONSTRAINT "department_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_department_manager_id_fkey" FOREIGN KEY ("department_manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave_balance" ADD CONSTRAINT "leave_balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave_balance" ADD CONSTRAINT "leave_balance_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave_balance" ADD CONSTRAINT "leave_balance_fiscal_year_id_fkey" FOREIGN KEY ("fiscal_year_id") REFERENCES "fiscal_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave_balance" ADD CONSTRAINT "leave_balance_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave_balance" ADD CONSTRAINT "leave_balance_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_fiscal_year_id_fkey" FOREIGN KEY ("fiscal_year_id") REFERENCES "fiscal_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave" ADD CONSTRAINT "leave_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leave_transaction" ADD CONSTRAINT "leave_transaction_leave_id_fkey" FOREIGN KEY ("leave_id") REFERENCES "leave"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
