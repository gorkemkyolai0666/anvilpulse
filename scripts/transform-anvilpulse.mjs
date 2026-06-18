#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const dirRenames = [
  ['printshop', 'workshop'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];

const backendSrc = path.join(root, 'backend/src');
for (const [from, to] of dirRenames) {
  const src = path.join(backendSrc, from);
  const dest = path.join(backendSrc, to);
  if (fs.existsSync(src)) fs.renameSync(src, dest);
}

const fileRenames = [
  ['printshop', 'workshop', 'printshop', 'workshop'],
  ['jobs', 'projects', 'jobs', 'projects'],
  ['jobs', 'projects', 'job', 'project'],
  ['paper-stock', 'materials', 'paper-stock', 'materials'],
  ['paper-stock', 'materials', 'paper-stock', 'material'],
  ['proofs', 'site-visits', 'proofs', 'site-visits'],
  ['proofs', 'site-visits', 'proof', 'site-visit'],
  ['maintenance', 'welding', 'maintenance', 'welding'],
  ['finishes', 'surface-finishes', 'finishes', 'surface-finishes'],
  ['finishes', 'surface-finishes', 'finish', 'surface-finish'],
];

for (const [, targetDir, from, to] of fileRenames) {
  const dirPath = path.join(backendSrc, targetDir);
  if (!fs.existsSync(dirPath)) continue;
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.includes(from)) {
        const next = path.join(d, entry.name.replace(new RegExp(from, 'g'), to));
        if (next !== full) fs.renameSync(full, next);
      }
    }
  };
  walk(dirPath);
}

const replacements = [
  ['AnvilPulse', 'AnvilPulse'],
  ['anvilpulse', 'anvilpulse'],
  ['WorkshopModule', 'WorkshopModule'],
  ['WorkshopService', 'WorkshopService'],
  ['WorkshopController', 'WorkshopController'],
  ['ProjectsModule', 'ProjectsModule'],
  ['ProjectsService', 'ProjectsService'],
  ['ProjectsController', 'ProjectsController'],
  ['MaterialsModule', 'MaterialsModule'],
  ['MaterialsService', 'MaterialsService'],
  ['MaterialsController', 'MaterialsController'],
  ['SiteVisitsModule', 'SiteVisitsModule'],
  ['SiteVisitsService', 'SiteVisitsService'],
  ['SiteVisitsController', 'SiteVisitsController'],
  ['WeldingModule', 'WeldingModule'],
  ['WeldingService', 'WeldingService'],
  ['WeldingController', 'WeldingController'],
  ['SurfaceFinishesModule', 'SurfaceSurfaceFinishesModule'],
  ['SurfaceFinishesService', 'SurfaceSurfaceFinishesService'],
  ['SurfaceFinishesController', 'SurfaceSurfaceFinishesController'],
  ['workshop', 'workshop'],
  ['workshops', 'workshops'],
  ['Workshop', 'Workshop'],
  ['workshopId', 'workshopId'],
  ['fabricationProject', 'fabricationProject'],
  ['fabricationProjects', 'fabricationProjects'],
  ['FabricationProject', 'FabricationProject'],
  ['materialStock', 'materialStock'],
  ['MaterialStock', 'MaterialStock'],
  ['siteVisit', 'siteVisit'],
  ['siteVisits', 'siteVisits'],
  ['SiteVisit', 'SiteVisit'],
  ['weldingTask', 'weldingTask'],
  ['WeldingTask', 'WeldingTask'],
  ['surfaceFinish', 'surfaceFinish'],
  ['surfaceFinishes', 'surfaceFinishes'],
  ['SurfaceFinish', 'SurfaceFinish'],
  ['FabricationProjectStatus', 'ProjectStatus'],
  ['FabricationProjectType', 'ProjectType'],
  ['MaterialStockStatus', 'MaterialStatus'],
  ['SiteVisitStatus', 'SiteVisitStatus'],
  ['MeasurementQuality', 'MeasurementQuality'],
  ['WeldingStatus', 'WeldingStatus'],
  ['WeldingCategory', 'WeldingCategory'],
  ['SurfaceCategory', 'SurfaceCategory'],
  ['SurfaceStatus', 'SurfaceStatus'],
  ['projectNumber', 'projectNumber'],
  ['clientName', 'clientName'],
  ['projectType', 'projectType'],
  ['stationName', 'stationName'],
  ['lotName', 'lotName'],
  ['materialGrade', 'materialGrade'],
  ['quantityKg', 'quantityKg'],
  ['materialUnit', 'materialUnit'],
  ['visitedAt', 'visitedAt'],
  ['measurementQuality', 'measurementQuality'],
  ['revisionNotes', 'revisionNotes'],
  ['pricePerSqm', 'pricePerSqm'],
  ['leadDays', 'leadDays'],
  ['surfaceCategory', 'surfaceCategory'],
  ['totalStations', 'totalStations'],
  ['totalMaterialStock', 'totalMaterialStock'],
  ['approvedVisits', 'approvedVisits'],
  ['pendingRevisions', 'pendingRevisions'],
  ['pendingWelding', 'pendingWelding'],
  ['seasonalFinishes', 'seasonalFinishes'],
  ['materialWeight', 'materialWeight'],
  ['recentVisits', 'recentVisits'],
  ['stations', 'stations'],
  ['projectThroughputRate', 'projectThroughputRate'],
  ['totalProjects', 'totalProjects'],
  ['activeProjects', 'activeProjects'],
  ['cancelledProjects', 'cancelledProjects'],
  ["@Controller('workshop')", "@Controller('workshop')"],
  ["@Controller('projects')", "@Controller('projects')"],
  ["@Controller('materials')", "@Controller('materials')"],
  ["@Controller('site-visits')", "@Controller('site-visits')"],
  ["@Controller('welding')", "@Controller('welding')"],
  ["@Controller('surface-finishes')", "@Controller('surface-finishes')"],
  ['4022', '4022'],
  ['3022', '3022'],
  ['demo@istanbuldemiratolyesi.com', 'demo@istanbuldemiratolyesi.com'],
  ['İstanbul Demir Atölyesi', 'İstanbul Demir Atölyesi'],
];

function walkFiles(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.next') {
      walkFiles(full, cb);
    } else if (entry.isFile() && /\.(ts|tsx|js|json|sh|md|css|yml|mjs|prisma|sql)$/.test(entry.name)) {
      cb(full);
    }
  }
}

walkFiles(root, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(file, content);
});

// Frontend route renames
const frontendApp = path.join(root, 'frontend/src/app');
const routeRenames = [
  ['printshop', 'workshop'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];
for (const [from, to] of routeRenames) {
  const src = path.join(frontendApp, from);
  const dest = path.join(frontendApp, to);
  if (fs.existsSync(src)) fs.renameSync(src, dest);
}

console.log('AnvilPulse transform complete');
