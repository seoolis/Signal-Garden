import { demoActivity, demoSignals } from '../data/demo.js';

export const STORAGE_KEY = 'signal-garden-v3';

export function demoState() {
  return {
    signals: structuredClone(demoSignals),
    activity: structuredClone(demoActivity)
  };
}

export function loadGarden() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return demoState();
    const value = JSON.parse(raw);
    if (!Array.isArray(value.signals) || !Array.isArray(value.activity)) throw new Error('Invalid storage shape');
    return value;
  } catch {
    return demoState();
  }
}

export function saveGarden(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
