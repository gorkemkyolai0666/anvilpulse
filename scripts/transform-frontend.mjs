#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'frontend');

const routeRenames = [
  ['printshop', 'workshop'],
  ['jobs', 'projects'],
  ['paper-stock', 'materials'],
  ['proofs', 'site-visits'],
  ['maintenance', 'welding'],
  ['finishes', 'surface-finishes'],
];

const appDir = path.join(root, 'src/app');
for (const [from, to] of routeRenames) {
  const src = path.join(appDir, from);
  const dest = path.join(appDir, to);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
    fs.renameSync(src, dest);
  }
}

const replacements = [
  ['PressPulse', 'AnvilPulse'],
  ['presspulse', 'anvilpulse'],
  ['Press<span', 'Anvil<span'],
  ['printShop', 'workshop'],
  ['printShopName', 'workshopName'],
  ['printshop', 'workshop'],
  ['/jobs', '/projects'],
  ['/paper-stock', '/materials'],
  ['/proofs', '/site-visits'],
  ['/maintenance', '/welding'],
  ['/finishes', '/surface-finishes'],
  ['/printshop', '/workshop'],
  ["listRequest('/jobs'", "listRequest('/projects'"],
  ["request('/jobs'", "request('/projects'"],
  ["`/jobs/${", "`/projects/${"],
  ["listRequest('/paper-stock'", "listRequest('/materials'"],
  ["request('/paper-stock'", "request('/materials'"],
  ["`/paper-stock/${", "`/materials/${"],
  ["listRequest('/proofs'", "listRequest('/site-visits'"],
  ["request('/proofs'", "request('/site-visits'"],
  ["`/proofs/${", "`/site-visits/${"],
  ["listRequest('/maintenance'", "listRequest('/welding'"],
  ["request('/maintenance'", "request('/welding'"],
  ["`/maintenance/${", "`/welding/${"],
  ["listRequest('/finishes'", "listRequest('/surface-finishes'"],
  ["request('/finishes'", "request('/surface-finishes'"],
  ["`/finishes/${", "`/surface-finishes/${"],
  ["request('/printshop'", "request('/workshop'"],
  ['api.jobs', 'api.projects'],
  ['api.materialStock', 'api.materials'],
  ['api.proofs', 'api.siteVisits'],
  ['api.maintenance', 'api.welding'],
  ['api.finishes', 'api.surfaceFinishes'],
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
  ['finishCategory', 'surfaceCategory'],
  ['pricePerUnit', 'pricePerSqm'],
  ['setupMinutes', 'leadDays'],
  ['totalJobs', 'totalProjects'],
  ['activeJobs', 'activeProjects'],
  ['totalPaperStock', 'totalMaterialStock'],
  ['stockWeight', 'materialWeight'],
  ['revisionProofs', 'pendingRevisions'],
  ['pendingMaintenance', 'pendingWelding'],
  ['recentProofs', 'recentVisits'],
  ['jobThroughputRate', 'projectThroughputRate'],
  ['4021', '4022'],
  ['3021', '3022'],
  ['demo@istanbulprintstudio.com', 'demo@istanbuldemiratolyesi.com'],
  ['İstanbul Print Studio', 'İstanbul Demir Atölyesi'],
  ['pp-nav-link', 'ap-nav-link'],
  ['pp-stat', 'ap-stat'],
  ['pp-card', 'ap-card'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.next'].includes(entry.name)) walk(full, cb);
    else if (/\.(ts|tsx|css|js|json)$/.test(entry.name)) cb(full);
  }
}

walk(path.join(root, 'src'), (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

console.log('Frontend transform complete');
