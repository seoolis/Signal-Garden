function makeEvent(signal, type, detail) {
  return { id: crypto.randomUUID(), signalId: signal.id, signalTitle: signal.title, type, detail, createdAt: Date.now() };
}

export class GardenStore {
  #state;
  #listeners = new Set();
  #persist;

  constructor(initialState, persist = () => {}) {
    this.#state = structuredClone(initialState);
    this.#persist = persist;
  }

  getState() { return this.#state; }
  subscribe(listener) { this.#listeners.add(listener); return () => this.#listeners.delete(listener); }
  #commit(next) { this.#state = next; this.#persist(next); this.#listeners.forEach((listener) => listener(next)); }
  #withEvent(signals, event) { return { signals, activity: [event, ...this.#state.activity].slice(0, 120) }; }

  create(draft) {
    const timestamp = Date.now();
    const signal = { ...draft, id: crypto.randomUUID(), createdAt: timestamp, updatedAt: timestamp };
    this.#commit(this.#withEvent([signal, ...this.#state.signals], makeEvent(signal, 'created', 'Новый сигнал добавлен в сад')));
    return signal;
  }

  update(id, patch) {
    const current = this.#state.signals.find((signal) => signal.id === id);
    if (!current) return;
    const updated = { ...current, ...patch, updatedAt: Date.now() };
    this.#commit(this.#withEvent(this.#state.signals.map((signal) => signal.id === id ? updated : signal), makeEvent(updated, 'updated', 'Параметры сигнала обновлены')));
  }

  move(id, stage) {
    const current = this.#state.signals.find((signal) => signal.id === id);
    if (!current || current.stage === stage) return;
    const updated = { ...current, stage, updatedAt: Date.now() };
    const label = { seed:'Seed', growing:'Growing', bloom:'Bloom' }[stage];
    this.#commit(this.#withEvent(this.#state.signals.map((signal) => signal.id === id ? updated : signal), makeEvent(updated, 'moved', `Переведено в ${label}`)));
  }

  boost(id) {
    const current = this.#state.signals.find((signal) => signal.id === id);
    if (!current) return;
    const updated = { ...current, energy: Math.min(100, current.energy + 8), updatedAt: Date.now() };
    this.#commit(this.#withEvent(this.#state.signals.map((signal) => signal.id === id ? updated : signal), makeEvent(updated, 'boosted', `Энергия поднята до ${updated.energy}%`)));
  }

  remove(id) {
    const current = this.#state.signals.find((signal) => signal.id === id);
    if (!current) return;
    this.#commit(this.#withEvent(this.#state.signals.filter((signal) => signal.id !== id), makeEvent(current, 'deleted', 'Сигнал удалён')));
  }

  replace(nextState) {
    this.#commit(structuredClone(nextState));
  }
}
