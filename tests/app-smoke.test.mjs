import test from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  #data = new Map();
  getItem(key) { return this.#data.has(key) ? this.#data.get(key) : null; }
  setItem(key, value) { this.#data.set(key, String(value)); }
}

test('application entry renders the overview without a bundler', async () => {
  const root = {
    innerHTML: '',
    addEventListener() {},
    querySelector() { return null; }
  };

  globalThis.localStorage = new MemoryStorage();
  globalThis.location = { pathname: '/' };
  globalThis.history = { pushState() {} };
  globalThis.scrollTo = () => {};
  globalThis.requestAnimationFrame = (callback) => callback();
  globalThis.matchMedia = () => ({ matches: false });
  globalThis.window = { addEventListener() {} };
  globalThis.document = {
    documentElement: { dataset: {} },
    activeElement: null,
    querySelector(selector) { return selector === '#app' ? root : null; }
  };

  await import(`../src/main.js?smoke=${Date.now()}`);

  assert.match(root.innerHTML, /class="app-layout"/);
  assert.match(root.innerHTML, /Signal Garden/);
  assert.match(root.innerHTML, /Сильнейший сигнал/);
});
