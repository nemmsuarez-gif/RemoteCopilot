import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSalary } from '../src/parsers/salaryParser.js';
import { classifyRemoteType } from '../src/parsers/remoteClassifier.js';
import { parseJobInput } from '../src/parsers/jobParser.js';

test('parseSalary handles yearly k ranges', () => {
  const parsed = parseSalary('Compensation: $120k - $150k per year');
  assert.equal(parsed.salaryMin, 120000);
  assert.equal(parsed.salaryMax, 150000);
});

test('classifyRemoteType identifies hybrid before generic remote', () => {
  assert.equal(classifyRemoteType('This is a hybrid remote role'), 'hybrid');
});

test('parseJobInput returns normalized fields', () => {
  const parsed = parseJobInput({
    sourceName: 'LinkedIn',
    pastedText: 'Title: Senior Backend Engineer\nCompany: Acme\nLocation: Austin, TX\nHybrid role',
  });

  assert.equal(parsed.title, 'Senior Backend Engineer');
  assert.equal(parsed.company, 'Acme');
  assert.equal(parsed.remoteType, 'hybrid');
  assert.equal(parsed.sourceName, 'linkedin');
});
