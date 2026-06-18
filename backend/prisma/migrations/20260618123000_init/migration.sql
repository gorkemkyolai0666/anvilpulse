-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'fabricator');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('quoted', 'designing', 'fabricating', 'welding', 'finishing', 'installed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('railing', 'gate', 'balcony', 'staircase', 'canopy', 'custom');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('in_stock', 'low', 'reorder', 'out_of_stock');

-- CreateEnum
CREATE TYPE "MaterialUnit" AS ENUM ('bundle', 'sheet', 'coil', 'bar');

-- CreateEnum
CREATE TYPE "SiteVisitStatus" AS ENUM ('scheduled', 'completed', 'revision', 'approved', 'cancelled');

-- CreateEnum
CREATE TYPE "MeasurementQuality" AS ENUM ('excellent', 'good', 'needs_review', 'rejected');

-- CreateEnum
CREATE TYPE "WeldingStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "WeldingCategory" AS ENUM ('mig', 'tig', 'arc', 'plasma', 'grinding', 'other');

-- CreateEnum
CREATE TYPE "SurfaceCategory" AS ENUM ('galvanizing', 'powder_coat', 'paint', 'patina', 'rust_proof', 'other');

-- CreateEnum
CREATE TYPE "SurfaceStatus" AS ENUM ('active', 'seasonal', 'discontinued');

-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_stations" INTEGER NOT NULL DEFAULT 4,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "workshop_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabrication_projects" (
    "id" TEXT NOT NULL,
    "workshop_id" TEXT NOT NULL,
    "project_number" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "project_type" "ProjectType" NOT NULL DEFAULT 'railing',
    "quantity" INTEGER,
    "status" "ProjectStatus" NOT NULL DEFAULT 'quoted',
    "due_date" DATE,
    "station_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabrication_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_stock" (
    "id" TEXT NOT NULL,
    "workshop_id" TEXT NOT NULL,
    "project_id" TEXT,
    "lot_name" TEXT NOT NULL,
    "material_grade" TEXT,
    "quantity_kg" DOUBLE PRECISION NOT NULL,
    "material_unit" "MaterialUnit" NOT NULL DEFAULT 'bar',
    "status" "MaterialStatus" NOT NULL DEFAULT 'in_stock',
    "received_at" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_visits" (
    "id" TEXT NOT NULL,
    "workshop_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL,
    "measurement_quality" "MeasurementQuality" NOT NULL DEFAULT 'good',
    "revision_notes" TEXT,
    "status" "SiteVisitStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welding_tasks" (
    "id" TEXT NOT NULL,
    "workshop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "WeldingCategory" NOT NULL DEFAULT 'mig',
    "station_name" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "WeldingStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "welding_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surface_finishes" (
    "id" TEXT NOT NULL,
    "workshop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "surface_category" "SurfaceCategory" NOT NULL DEFAULT 'galvanizing',
    "status" "SurfaceStatus" NOT NULL DEFAULT 'active',
    "price_per_sqm" DOUBLE PRECISION NOT NULL,
    "lead_days" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surface_finishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "fabrication_projects_workshop_id_status_idx" ON "fabrication_projects"("workshop_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "fabrication_projects_workshop_id_project_number_key" ON "fabrication_projects"("workshop_id", "project_number");

-- CreateIndex
CREATE INDEX "material_stock_workshop_id_status_idx" ON "material_stock"("workshop_id", "status");

-- CreateIndex
CREATE INDEX "site_visits_workshop_id_status_idx" ON "site_visits"("workshop_id", "status");

-- CreateIndex
CREATE INDEX "site_visits_workshop_id_visited_at_idx" ON "site_visits"("workshop_id", "visited_at");

-- CreateIndex
CREATE INDEX "welding_tasks_workshop_id_scheduled_at_idx" ON "welding_tasks"("workshop_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "surface_finishes_workshop_id_surface_category_idx" ON "surface_finishes"("workshop_id", "surface_category");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fabrication_projects" ADD CONSTRAINT "fabrication_projects_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_stock" ADD CONSTRAINT "material_stock_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_stock" ADD CONSTRAINT "material_stock_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "fabrication_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_visits" ADD CONSTRAINT "site_visits_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_visits" ADD CONSTRAINT "site_visits_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "fabrication_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welding_tasks" ADD CONSTRAINT "welding_tasks_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surface_finishes" ADD CONSTRAINT "surface_finishes_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

┌─────────────────────────────────────────────────────────┐
│  Update available 5.22.0 -> 7.8.0                       │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
