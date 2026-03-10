import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFitScore } from '../src/scoring/fitScorer.js';

test('fully remote priority penalizes onsite heavily', () => {
  const result = calculateFitScore({
    preferences: {
      preferredTitles: ['Engineer'],
      skills: ['node', 'postgres'],
      salaryTargetMin: 100000,
      salaryTargetMax: 180000,
      remotePreference: 'fully_remote',
      prioritizeFullyRemote: true,
      preferredLocations: ['united states'],
      experienceLevel: 'senior',
    },
    job: {
      title: 'Senior Software Engineer',
      cleanedJobText: 'senior node postgres role',
      salaryMin: 140000,
      salaryMax: 170000,
      remoteType: 'onsite',
      location: 'United States',
    },
  });

  assert.ok(result.fitScore < 70);
  assert.match(result.fitReasoning, /penalized/i);
});
