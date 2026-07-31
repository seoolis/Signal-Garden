import { loadGarden, saveGarden, demoState } from './lib/storage.js';
import { GardenStore } from './store/garden-store.js';
import { shell, formModal } from './views/components.js';
import { analyticsPage, gardenPage, overviewPage, settingsPage } from './views/pages.js';

const root = document.querySelector('#app');
const store = new GardenStore(loadGarden(), saveGarden);
const ui = { modal: null, query: '', category: 'all', draggedId: null, status: '' };

function normalizePath(pathname) {
  return ['/','/garden','/analytics','/settings'].includes(pathname) ? pathname : '/';
}

function pageFor(path) {
  const state = store.getState();
  if (path === '/garden') return gardenPage(state, ui);
  if (path === '/analytics') return analyticsPage(state);
  if (path === '/settings') return settingsPage(state);
  return overviewPage(state);
}

function render() {
  const path = normalizePath(location.pathname);
  root.innerHTML = shell(path, pageFor(path)) + (ui.modal ? formModal(ui.modal === 'create' ? null : store.getState().signals.find((s)=>s.id===ui.modal)) : '');
  if (path === '/settings' && ui.status) root.querySelector('[data-status]').innerHTML = `<div class="status-toast">${ui.status}</div>`;
}

function navigate(path) {
  history.pushState({}, '', path);
  render();
  scrollTo({ top: 0, behavior: 'smooth' });
}

function openCreate() { ui.modal = 'create'; render(); requestAnimationFrame(()=>root.querySelector('input[name="title"]')?.focus()); }
function openEdit(id) { ui.modal = id; render(); requestAnimationFrame(()=>root.querySelector('input[name="title"]')?.focus()); }
function closeModal() { ui.modal = null; render(); }

root.addEventListener('click', (event) => {
  const link = event.target.closest('[data-link]');
  if (link) { event.preventDefault(); navigate(link.getAttribute('href')); return; }
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const { action, id } = actionEl.dataset;
  if (action === 'create') openCreate();
  if (action === 'edit') openEdit(id);
  if (action === 'close-modal') closeModal();
  if (action === 'close-modal-bg' && event.target === actionEl) closeModal();
  if (action === 'theme') {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next; localStorage.setItem('signal-garden-theme', next);
  }
  if (action === 'boost') store.boost(id);
  if (action === 'delete') {
    const signal = store.getState().signals.find((s)=>s.id===id);
    if (signal && confirm(`Удалить «${signal.title}»?`)) store.remove(id);
  }
  if (action === 'export') {
    const blob = new Blob([JSON.stringify(store.getState(), null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `signal-garden-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
    ui.status = 'Экспорт готов.'; render();
  }
  if (action === 'import') root.querySelector('[data-import-file]')?.click();
  if (action === 'restore' && confirm('Вернуть демонстрационные данные?')) { store.replace(demoState()); ui.status='Demo state восстановлен.'; }
});

root.addEventListener('input', (event) => {
  if (event.target.matches('[data-filter="query"]')) { ui.query = event.target.value; render(); root.querySelector('[data-filter="query"]')?.focus(); }
  if (event.target.matches('input[type="range"]')) {
    const output = root.querySelector(`[data-output="${event.target.name}"]`); if (output) output.textContent = `${event.target.value}%`;
  }
});

root.addEventListener('change', async (event) => {
  if (event.target.matches('[data-filter="category"]')) { ui.category = event.target.value; render(); }
  if (event.target.matches('[data-import-file]')) {
    const file = event.target.files?.[0]; if (!file) return;
    try { const parsed = JSON.parse(await file.text()); if (!Array.isArray(parsed.signals)||!Array.isArray(parsed.activity)) throw new Error(); store.replace(parsed); ui.status='Данные импортированы.'; }
    catch { ui.status='Не удалось импортировать файл: неверный формат.'; render(); }
  }
});

root.addEventListener('submit', (event) => {
  if (!event.target.matches('[data-form="signal"]')) return;
  event.preventDefault();
  const fd = new FormData(event.target);
  const draft = {
    title: String(fd.get('title')).trim(), description: String(fd.get('description')).trim(), nextAction: String(fd.get('nextAction')).trim(),
    category: String(fd.get('category')), stage: String(fd.get('stage')), energy: Number(fd.get('energy')), confidence: Number(fd.get('confidence')),
    tags: String(fd.get('tags')).split(',').map((tag)=>tag.trim().toLowerCase()).filter(Boolean).slice(0,5)
  };
  const id = event.target.dataset.id;
  if (id) store.update(id, draft); else store.create(draft);
  ui.modal = null;
});

root.addEventListener('dragstart', (event) => { const card = event.target.closest('[data-drag-id]'); if (card) ui.draggedId = card.dataset.dragId; });
root.addEventListener('dragover', (event) => { if (event.target.closest('[data-drop-stage]')) event.preventDefault(); });
root.addEventListener('drop', (event) => { const column = event.target.closest('[data-drop-stage]'); if (column && ui.draggedId) { event.preventDefault(); store.move(ui.draggedId, column.dataset.dropStage); ui.draggedId = null; } });

window.addEventListener('popstate', render);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && ui.modal) closeModal();
  const tag = document.activeElement?.tagName; if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
  if (event.key.toLowerCase() === 'n') openCreate();
});

const theme = localStorage.getItem('signal-garden-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
document.documentElement.dataset.theme = theme;
store.subscribe(render);
render();
