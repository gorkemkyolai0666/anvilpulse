#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const src = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), 'backend/src');

const replacements = [
  ["from './jobs.controller'", "from './projects.controller'"],
  ["from './jobs.service'", "from './projects.service'"],
  ["from './dto/job.dto'", "from './dto/project.dto'"],
  ["from './printshop.controller'", "from './workshop.controller'"],
  ["from './printshop.service'", "from './workshop.service'"],
  ["from './paper-stock.controller'", "from './materials.controller'"],
  ["from './paper-stock.service'", "from './materials.service'"],
  ["from './proofs.controller'", "from './site-visits.controller'"],
  ["from './proofs.service'", "from './site-visits.service'"],
  ["from './maintenance.controller'", "from './welding.controller'"],
  ["from './maintenance.service'", "from './welding.service'"],
  ["from './finishes.controller'", "from './surface-finishes.controller'"],
  ["from './finishes.service'", "from './surface-finishes.service'"],
  ["from './dto/paper-stock.dto'", "from './dto/materials.dto'"],
  ["from './dto/proof.dto'", "from './dto/site-visit.dto'"],
  ["from './dto/maintenance.dto'", "from './dto/welding.dto'"],
  ["from './dto/finish.dto'", "from './dto/surface-finish.dto'"],
  ['MaterialStockStatus', 'MaterialStatus'],
  ['FabricationProjectStatus', 'ProjectStatus'],
  ['FabricationProjectType', 'ProjectType'],
  ['proofs:', 'siteVisits:'],
  ['include: { proofs', 'include: { siteVisits'],
  ['job: { select: { projectNumber: true, clientName: true } }', 'project: { select: { projectNumber: true, clientName: true } }'],
  ['include: { job:', 'include: { project:'],
  ['revisionNotes?: number', 'revisionNotes?: string'],
];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.name.endsWith('.ts')) cb(full);
  }
}

walk(src, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) content = content.split(from).join(to);
  fs.writeFileSync(file, content);
});

console.log('Fixed backend imports');
