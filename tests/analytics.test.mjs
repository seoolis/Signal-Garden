import test from 'node:test';
import assert from 'node:assert/strict';
import { averageConfidence, averageEnergy, momentumScore, stageCounts } from '../src/lib/analytics.js';

const signals = [
  { energy:80, confidence:60, stage:'seed' },
  { energy:60, confidence:80, stage:'bloom' }
];

test('analytics derive averages and stage counts', () => {
  assert.equal(averageEnergy(signals), 70);
  assert.equal(averageConfidence(signals), 70);
  assert.deepEqual(stageCounts(signals), { seed:1, growing:0, bloom:1 });
});

test('momentum uses recent activity and bloom count', () => {
  const now = 10_000_000;
  const activity = [{ createdAt:now-1000 }, { createdAt:now-700_000_000 }];
  assert.equal(momentumScore(signals, activity, now), 53);
});
