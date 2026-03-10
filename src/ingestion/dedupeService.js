import crypto from 'node:crypto';
import { normalizeCompany, normalizeLocation, normalizeTitle } from '../parsers/fieldNormalizer.js';

export function buildDedupeFingerprint(job) {
  const stable = [
    normalizeTitle(job.title),
    normalizeCompany(job.company),
    normalizeLocation(job.location),
    job.sourceUrl || '',
    job.postedDate || '',
  ].join('|');

  return crypto.createHash('sha256').update(stable).digest('hex');
}

export function assignDuplicateGroupId(job) {
  return buildDedupeFingerprint(job).slice(0, 32);
}
