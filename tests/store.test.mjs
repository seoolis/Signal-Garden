import test from 'node:test';
import assert from 'node:assert/strict';
import { GardenStore } from '../src/store/garden-store.js';

const initial = { signals:[{ id:'x', title:'X', stage:'seed', energy:95, confidence:50, updatedAt:1 }], activity:[] };

test('store moves a signal and records activity', () => {
  const store = new GardenStore(initial);
  store.move('x', 'growing');
  assert.equal(store.getState().signals[0].stage, 'growing');
  assert.equal(store.getState().activity[0].type, 'moved');
});

test('boost is capped at 100', () => {
  const store = new GardenStore(initial);
  store.boost('x');
  assert.equal(store.getState().signals[0].energy, 100);
});
