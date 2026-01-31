/**
 * One-off script: import resources from CSV + local images into Sanity.
 *
 * Usage:
 *   npx tsx scripts/import-resources.ts [csvPath] [imagesDir]
 *
 * Env (all required — no fallbacks; script exits if any missing):
 *   SANITY_PROJECT_ID
 *   SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 *
 * Optional:
 *   IMPORT_LIMIT   e.g. 2 for testing
 *
 * Defaults: csvPath = data/resources.csv, imagesDir = data/images
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// --- Required env (no fallbacks)
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID. Set it in .env or the environment.');
  process.exit(1);
}
if (!dataset) {
  console.error('Missing SANITY_DATASET. Set it in .env or the environment.');
  process.exit(1);
}
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN. Set it in .env or the environment.');
  process.exit(1);
}

const importLimit = process.env.IMPORT_LIMIT ? parseInt(process.env.IMPORT_LIMIT, 10) : undefined;
const csvPath = path.resolve(process.argv[2] || 'data/resources.csv');
const imagesDir = path.resolve(process.argv[3] || 'data/images');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// --- Helpers
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitTrim(s: string | undefined): string[] {
  if (!s || !s.trim()) return [];
  return s.split(',').map((t) => t.trim()).filter(Boolean);
}

async function findDocByTitle(type: string, title: string): Promise<string | null> {
  const q = `*[_type == $type && title == $title][0]._id`;
  const id = await client.fetch<string | null>(q, { type, title: title.trim() });
  return id;
}

async function uploadImage(filePath: string, filename: string): Promise<string> {
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, {
    filename: filename || path.basename(filePath),
  });
  return asset._id;
}

// --- Main
async function main() {
  console.log('Config:', { projectId, dataset, csvPath, imagesDir, importLimit: importLimit ?? 'unlimited' });

  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  if (!fs.existsSync(imagesDir)) {
    console.error('Images dir not found:', imagesDir);
    process.exit(1);
  }

  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<Record<string, string>>;

  const toProcess = importLimit ? rows.slice(0, importLimit) : rows;
  console.log(`Processing ${toProcess.length} row(s) (total rows in CSV: ${rows.length})\n`);

  for (let i = 0; i < toProcess.length; i++) {
    const row = toProcess[i];
    const name = row.name?.trim();
    const sourceUrl = row.sourceUrl?.trim();
    const categoryTitle = row.category?.trim();
    const imageFilename = row.imageFilename?.trim();

    if (!name || !sourceUrl) {
      console.log(`Row ${i + 1}: Skipping (missing name or sourceUrl).`);
      continue;
    }

    // Required: category
    if (!categoryTitle) {
      console.log(`Row ${i + 1} (${name}): Skipping (category empty).`);
      continue;
    }
    const categoryId = await findDocByTitle('category', categoryTitle);
    if (!categoryId) {
      console.log(`Row ${i + 1} (${name}): Skipping — category not found: "${categoryTitle}"`);
      continue;
    }

    // Optional refs: skip if missing, log
    const tagTitles = splitTrim(row.tags);
    const tagRefs: { _type: 'reference'; _ref: string }[] = [];
    for (const t of tagTitles) {
      const id = await findDocByTitle('tag', t);
      if (id) tagRefs.push({ _type: 'reference', _ref: id });
      else console.log(`  Tag not found (skipping ref): "${t}"`);
    }

    const uiTitles = splitTrim(row.uiElements);
    const uiRefs: { _type: 'reference'; _ref: string }[] = [];
    for (const u of uiTitles) {
      const id = await findDocByTitle('uiElement', u);
      if (id) uiRefs.push({ _type: 'reference', _ref: id });
      else console.log(`  UI Element not found (skipping ref): "${u}"`);
    }

    let applicationRef: { _type: 'reference'; _ref: string } | undefined;
    const appTitle = row.application?.trim();
    if (appTitle) {
      const appId = await findDocByTitle('application', appTitle);
      if (appId) applicationRef = { _type: 'reference', _ref: appId };
      else console.log(`  Application not found (skipping ref): "${appTitle}"`);
    }

    // Image
    if (!imageFilename) {
      console.log(`Row ${i + 1} (${name}): Skipping (imageFilename empty).`);
      continue;
    }
    const imagePath = path.join(imagesDir, imageFilename);
    if (!fs.existsSync(imagePath)) {
      console.log(`Row ${i + 1} (${name}): Skipping (image file not found: ${imagePath}).`);
      continue;
    }

    let assetId: string;
    try {
      assetId = await uploadImage(imagePath, imageFilename);
    } catch (e) {
      console.error(`Row ${i + 1} (${name}): Image upload failed:`, e);
      continue;
    }

    const doc = {
      _type: 'resource',
      name,
      slug: { _type: 'slug', current: slugify(name) },
      mainImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
      sourceUrl,
      sourceName: row.sourceName?.trim() || undefined,
      description: row.description?.trim() || undefined,
      category: { _type: 'reference', _ref: categoryId },
      tags: tagRefs,
      uiElements: uiRefs,
      application: applicationRef,
    };

    try {
      const created = await client.create(doc);
      console.log(`Row ${i + 1}: Created resource "${name}" (id: ${created._id})`);
    } catch (e) {
      console.error(`Row ${i + 1} (${name}): Create failed:`, e);
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
