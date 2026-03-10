import test from 'node:test';
import assert from 'node:assert/strict';
import { JobRepository } from '../src/ingestion/jobRepository.js';
import { JobIngestionService } from '../src/ingestion/jobIngestionService.js';
import { calculateFitScore } from '../src/scoring/fitScorer.js';

test('ingestion pipeline parses, scores, dedupes, and saves', async () => {
  const service = new JobIngestionService({ repository: new JobRepository(), scorer: calculateFitScore });
  const result = await service.ingest({
    input: {
      sourceUrl: 'https://jobs.example.com/1',
      sourceName: 'manual',
      pastedText: 'Title: Product Engineer\nCompany: Remote Inc\nLocation: US\nFully remote\n$140k - $160k',
      postedDate: '2025-01-01',
    },
    userPreferences: {
      preferredTitles: ['Engineer'],
      preferredLocations: ['us'],
      skills: ['remote'],
      remotePreference: 'fully_remote',
      prioritizeFullyRemote: true,
    },
  });

  assert.equal(result.status, 'saved');
  assert.ok(result.job.duplicateGroupId);
  assert.ok(typeof result.job.fitScore === 'number');
});
