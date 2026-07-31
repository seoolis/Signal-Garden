import { escapeHtml } from '../lib/html.js';
import { formatRelative } from '../lib/analytics.js';

export function signalCard(signal, { compact = false, draggable = false } = {}) {
  return `<article class="signal-card ${compact ? 'compact' : ''}" ${draggable ? `draggable="true" data-drag-id="${escapeHtml(signal.id)}"` : ''}>
    <div class="card-topline">
      <div class="tag-row"><span class="category-badge">${escapeHtml(signal.category)}</span><span class="stage-dot stage-${signal.stage}">${signal.stage}</span></div>
      <button class="icon-button small" data-action="edit" data-id="${escapeHtml(signal.id)}" aria-label="Редактировать">⋯</button>
    </div>
    <div class="card-copy"><h3>${escapeHtml(signal.title)}</h3><p>${escapeHtml(signal.description)}</p></div>
    ${compact ? '' : `<div class="tag-list">${signal.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join('')}</div>`}
    <div class="next-action"><span>Next action</span><strong>${escapeHtml(signal.nextAction)}</strong></div>
    <div class="metric-pair">
      <div><span>Energy</span><strong>${signal.energy}%</strong><i><b style="width:${signal.energy}%"></b></i></div>
      <div><span>Confidence</span><strong>${signal.confidence}%</strong><i><b style="width:${signal.confidence}%"></b></i></div>
    </div>
    <div class="card-footer"><span>обновлено ${formatRelative(signal.updatedAt)}</span><div><button class="text-button" data-action="boost" data-id="${escapeHtml(signal.id)}">+8 energy</button><button class="text-button danger" data-action="delete" data-id="${escapeHtml(signal.id)}">Удалить</button></div></div>
  </article>`;
}

export function shell(activePath, content) {
  const nav = [['/','⌂','Overview'],['/garden','⌘','Garden'],['/analytics','◒','Analytics'],['/settings','⚙','Settings']];
  return `<div class="app-layout">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">✦</span><div><strong>Signal Garden</strong><small>idea operating system</small></div></div>
      <nav>${nav.map(([path,icon,label]) => `<a href="${path}" data-link class="${activePath === path ? 'active' : ''}">${icon} <span>${label}</span></a>`).join('')}</nav>
      <div class="sidebar-note"><span>Local workspace</span><strong>Modular SPA</strong><small>Local-first architecture</small></div>
    </aside>
    <div class="content-shell">
      <header class="topbar"><div><span class="eyebrow">Workspace</span><strong>Personal R&D Lab</strong></div><div class="topbar-actions"><button class="icon-button" data-action="theme" aria-label="Переключить тему">◐</button><button class="button primary" data-action="create">＋ New signal <kbd>N</kbd></button></div></header>
      <main class="page">${content}</main>
    </div>
  </div>`;
}

export function formModal(signal = null) {
  const value = (key, fallback='') => escapeHtml(signal?.[key] ?? fallback);
  const stage = signal?.stage ?? 'seed';
  const category = signal?.category ?? 'Product';
  return `<div class="modal-backdrop" data-action="close-modal-bg"><section class="modal" role="dialog" aria-modal="true">
    <div class="modal-header"><div><span class="eyebrow">${signal ? 'Редактирование' : 'Новый сигнал'}</span><h2>${signal ? 'Обновить идею' : 'Посадить идею'}</h2></div><button class="icon-button" data-action="close-modal">×</button></div>
    <form class="signal-form" data-form="signal" data-id="${signal?.id || ''}">
      <label>Название<input name="title" required maxlength="64" value="${value('title')}" /></label>
      <label>Описание<textarea name="description" required maxlength="240" rows="3">${value('description')}</textarea></label>
      <label>Следующий конкретный шаг<input name="nextAction" required maxlength="120" value="${value('nextAction')}" placeholder="Собрать кликабельный прототип" /></label>
      <div class="form-grid"><label>Категория<select name="category">${['Product','UI/UX','AI','DevTool','Creative'].map((item) => `<option ${item===category?'selected':''}>${item}</option>`).join('')}</select></label><label>Стадия<select name="stage">${['seed','growing','bloom'].map((item) => `<option value="${item}" ${item===stage?'selected':''}>${item[0].toUpperCase()+item.slice(1)}</option>`).join('')}</select></label></div>
      <label>Теги<input name="tags" value="${escapeHtml(signal?.tags?.join(', ') || '')}" placeholder="frontend, maps, ai" /></label>
      <div class="range-grid"><label>Энергия <strong data-output="energy">${signal?.energy ?? 68}%</strong><input name="energy" type="range" min="0" max="100" value="${signal?.energy ?? 68}" /></label><label>Уверенность <strong data-output="confidence">${signal?.confidence ?? 60}%</strong><input name="confidence" type="range" min="0" max="100" value="${signal?.confidence ?? 60}" /></label></div>
      <div class="modal-actions"><button type="button" class="button secondary" data-action="close-modal">Отмена</button><button class="button primary" type="submit">${signal ? 'Сохранить' : 'Создать сигнал'}</button></div>
    </form>
  </section></div>`;
}
