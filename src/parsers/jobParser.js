import { parseSalary } from './salaryParser.js';
import { classifyRemoteType } from './remoteClassifier.js';
import { cleanJobText } from './textCleaner.js';
import { normalizeCompany, normalizeLocation, normalizeSourceName, normalizeTitle } from './fieldNormalizer.js';

function extractField(patterns, text) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

export function parseJobInput(input) {
  const rawText = input.rawJobText || input.pastedText || '';
  const cleaned = cleanJobText(rawText);

  const extractedTitle = extractField([/title:\s*(.+)/i, /role:\s*(.+)/i], cleaned);
  const extractedCompany = extractField([/company:\s*(.+)/i, /at\s+([\w\s&.,-]+)/i], cleaned);
  const extractedLocation = extractField([/location:\s*(.+)/i], cleaned);

  const salary = parseSalary(`${input.salaryText || ''}\n${cleaned}`);
  const remoteType = classifyRemoteType(`${input.remoteText || ''}\n${cleaned}`);

  return {
    sourceUrl: input.sourceUrl || null,
    sourceName: normalizeSourceName(input.sourceName),
    rawJobText: rawText || null,
    cleanedJobText: cleaned || null,
    title: normalizeTitle(input.title || extractedTitle || 'Untitled role'),
    company: normalizeCompany(input.company || extractedCompany || 'Unknown company'),
    location: input.location || extractedLocation || null,
    normalizedLocation: normalizeLocation(input.location || extractedLocation || ''),
    remoteType,
    salaryMin: salary?.salaryMin ?? null,
    salaryMax: salary?.salaryMax ?? null,
    currency: salary?.currency ?? 'USD',
    parserConfidence: cleaned ? 0.75 : 0.5,
  };
}
