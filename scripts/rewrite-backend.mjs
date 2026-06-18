#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const backendRoot = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'backend');

const dirRenames = [
  ['printshop', 'workshop'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];

const srcDir = path.join(backendRoot, 'src');
for (const [from, to] of dirRenames) {
  const src = path.join(srcDir, from);
  const dest = path.join(srcDir, to);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
    fs.renameSync(src, dest);
  }
}

const fileRenames = [
  ['workshop', 'printshop', 'workshop'],
  ['workshop', 'update-printshop', 'update-workshop'],
  ['projects', 'jobs', 'projects'],
  ['projects', 'job', 'project'],
  ['materials', 'paper-stock', 'materials'],
  ['site-visits', 'proofs', 'site-visits'],
  ['site-visits', 'proof', 'site-visit'],
  ['welding', 'maintenance', 'welding'],
  ['surface-finishes', 'finishes', 'surface-finishes'],
  ['surface-finishes', 'finish', 'surface-finish'],
];

for (const [dir, from, to] of fileRenames) {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) continue;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.includes(from)) {
        fs.renameSync(full, path.join(d, entry.name.replace(new RegExp(from, 'g'), to)));
      }
    }
  };
  walk(dirPath);
}

const replacements = [
  ['PressPulse', 'AnvilPulse'],
  ['presspulse', 'anvilpulse'],
  ['PrintshopModule', 'WorkshopModule'],
  ['PrintshopService', 'WorkshopService'],
  ['PrintshopController', 'WorkshopController'],
  ['UpdatePrintshopDto', 'UpdateWorkshopDto'],
  ['JobsModule', 'ProjectsModule'],
  ['JobsService', 'ProjectsService'],
  ['JobsController', 'ProjectsController'],
  ['CreateJobDto', 'CreateProjectDto'],
  ['UpdateJobDto', 'UpdateProjectDto'],
  ['PaperStockModule', 'MaterialsModule'],
  ['PaperStockService', 'MaterialsService'],
  ['PaperStockController', 'MaterialsController'],
  ['CreatePaperStockDto', 'CreateMaterialDto'],
  ['UpdatePaperStockDto', 'UpdateMaterialDto'],
  ['ProofsModule', 'SiteVisitsModule'],
  ['ProofsService', 'SiteVisitsService'],
  ['ProofsController', 'SiteVisitsController'],
  ['CreateProofDto', 'CreateSiteVisitDto'],
  ['UpdateProofDto', 'UpdateSiteVisitDto'],
  ['MaintenanceModule', 'WeldingModule'],
  ['MaintenanceService', 'WeldingService'],
  ['MaintenanceController', 'WeldingController'],
  ['CreateMaintenanceDto', 'CreateWeldingDto'],
  ['UpdateMaintenanceDto', 'UpdateWeldingDto'],
  ['FinishesModule', 'SurfaceFinishesModule'],
  ['FinishesService', 'SurfaceFinishesService'],
  ['FinishesController', 'SurfaceFinishesController'],
  ['CreateFinishDto', 'CreateSurfaceFinishDto'],
  ['UpdateFinishDto', 'UpdateSurfaceFinishDto'],
  ['printShop', 'workshop'],
  ['printShops', 'workshops'],
  ['PrintShop', 'Workshop'],
  ['printShopId', 'workshopId'],
  ['printShopName', 'workshopName'],
  ['printJob', 'fabricationProject'],
  ['printJobs', 'fabricationProjects'],
  ['PrintJob', 'FabricationProject'],
  ['paperStock', 'materialStock'],
  ['PaperStock', 'MaterialStock'],
  ['proofRound', 'siteVisit'],
  ['proofRounds', 'siteVisits'],
  ['ProofRound', 'SiteVisit'],
  ['machineMaintenance', 'weldingTask'],
  ['MachineMaintenance', 'WeldingTask'],
  ['printFinish', 'surfaceFinish'],
  ['printFinishes', 'surfaceFinishes'],
  ['PrintFinish', 'SurfaceFinish'],
  ['PrintJobStatus', 'ProjectStatus'],
  ['PrintJobType', 'ProjectType'],
  ['PaperStockStatus', 'MaterialStatus'],
  ['ProofRoundStatus', 'SiteVisitStatus'],
  ['ProofQuality', 'MeasurementQuality'],
  ['MaintenanceStatus', 'WeldingStatus'],
  ['MaintenanceCategory', 'WeldingCategory'],
  ['FinishCategory', 'SurfaceCategory'],
  ['FinishStatus', 'SurfaceStatus'],
  ['jobNumber', 'projectNumber'],
  ['customerName', 'clientName'],
  ['printType', 'projectType'],
  ['machineName', 'stationName'],
  ['batchName', 'lotName'],
  ['paperBrand', 'materialGrade'],
  ['weightKg', 'quantityKg'],
  ['storageUnit', 'materialUnit'],
  ['sentAt', 'visitedAt'],
  ['proofQuality', 'measurementQuality'],
  ['revisionCount', 'revisionNotes'],
  ['pricePerUnit', 'pricePerSqm'],
  ['setupMinutes', 'leadDays'],
  ['finishCategory', 'surfaceCategory'],
  ['totalMachines', 'totalStations'],
  ['totalPaperStock', 'totalMaterialStock'],
  ['approvedProofs', 'approvedVisits'],
  ['revisionProofs', 'pendingRevisions'],
  ['pendingMaintenance', 'pendingWelding'],
  ['stockWeight', 'materialWeight'],
  ['recentProofs', 'recentVisits'],
  ['machines', 'stations'],
  ['jobThroughputRate', 'projectThroughputRate'],
  ['totalJobs', 'totalProjects'],
  ['activeJobs', 'activeProjects'],
  ['cancelledJobs', 'cancelledProjects'],
  ['jobId', 'projectId'],
  ['StorageUnit', 'MaterialUnit'],
  ["@Controller('printshop')", "@Controller('workshop')"],
  ["@Controller('jobs')", "@Controller('projects')"],
  ["@Controller('paper-stock')", "@Controller('materials')"],
  ["@Controller('proofs')", "@Controller('site-visits')"],
  ["@Controller('maintenance')", "@Controller('welding')"],
  ["@Controller('finishes')", "@Controller('surface-finishes')"],
  ['Print job not found', 'Fabrication project not found'],
  ['Paper stock not found', 'Material stock not found'],
  ['Proof round not found', 'Site visit not found'],
  ['Maintenance record not found', 'Welding task not found'],
  ['Print finish not found', 'Surface finish not found'],
  ['4021', '4022'],
  ['demo@istanbulprintstudio.com', 'demo@istanbuldemiratolyesi.com'],
  ['İstanbul Print Studio', 'İstanbul Demir Atölyesi'],
  ["'in_progress', 'printing', 'finishing'", "'designing', 'fabricating', 'welding', 'finishing'"],
  ["status: 'ready'", "status: 'installed'"],
  ['revision', 'revision'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'dist'].includes(entry.name)) walk(full, cb);
    else if (entry.isFile() && /\.(ts|json)$/.test(entry.name)) cb(full);
  }
}

walk(path.join(backendRoot, 'src'), (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

walk(path.join(backendRoot, 'prisma'), (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

console.log('Backend rewrite complete');
