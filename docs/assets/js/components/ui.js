window.ANP = window.ANP || {};
ANP.ui = {
  activeModalCleanup: null,

  esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  },

  toast(message, type = 'info') {
    const root = document.getElementById('toast-root');
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.textContent = message;
    root.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  },

  closeModal() {
    if (this.activeModalCleanup) {
      this.activeModalCleanup();
      this.activeModalCleanup = null;
    }
    document.getElementById('dialog-root').innerHTML = '';
  },

  modal({ title, body, confirmText = '저장', cancelText = '닫기', danger = false }) {
    const root = document.getElementById('dialog-root');
    this.closeModal();
    root.innerHTML = `<div class="dialog-backdrop"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1"><h3 id="dialog-title">${this.esc(title)}</h3><div class="dialog-body">${body}</div><div class="dialog-actions"><button class="btn btn-tertiary" data-dialog="cancel">${this.esc(cancelText)}</button><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-dialog="confirm">${this.esc(confirmText)}</button></div></div></div>`;

    const backdrop = root.querySelector('.dialog-backdrop');
    const dialog = root.querySelector('.dialog');
    root.querySelector('[data-dialog="cancel"]').onclick = () => this.closeModal();
    backdrop.onclick = e => {
      if (e.target === e.currentTarget) this.closeModal();
    };

    const onKeydown = e => {
      if (e.key === 'Escape') this.closeModal();
      if (e.key !== 'Tab') return;
      const focusable = [...root.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    this.activeModalCleanup = () => document.removeEventListener('keydown', onKeydown);
    requestAnimationFrame(() => (root.querySelector('input, select, textarea, button') || dialog).focus());
    return root;
  },

  metric(label, value, desc = '') {
    return `<div class="card metric"><div class="metric-label">${this.esc(label)}</div><div class="metric-value">${this.esc(value)}</div>${desc ? `<div class="metric-desc">${this.esc(desc)}</div>` : ''}</div>`;
  },

  badge(value) {
    const text = String(value || '-');
    const key = text.toLowerCase().replaceAll(' ', '');
    let type = 'info';
    if (['완료', '승인', 'accepted', 'done', 'active', '사용'].includes(key)) type = 'success';
    if (['검토', '진행중', 'inprogress', 'review', 'open', '열림', '전체'].includes(key)) type = 'warning';
    if (['삭제', '반려', '오류', 'deprecated', 'inactive', '미사용'].includes(key)) type = 'danger';
    return `<span class="badge ${type}" title="${this.esc(text)}">${this.esc(text)}</span>`;
  },

  progress(value) {
    const n = Math.max(0, Math.min(100, parseFloat(String(value || '0').replace('%', '')) || 0));
    return `<div class="cell-text">${n}%</div><div class="progress" aria-label="진행률 ${n}%"><div style="width:${n}%"></div></div>`;
  },

  optionList(rows, valueKey, labelKey, selected = '', first = '선택하세요.') {
    const list = [`<option value="">${this.esc(first)}</option>`];
    (rows || []).forEach(row => {
      if (row.Enabled === 'N' || row.Status === '미사용') return;
      const value = row[valueKey] ?? '';
      const label = row[labelKey] ?? value;
      list.push(`<option value="${this.esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${this.esc(label)}</option>`);
    });
    return list.join('');
  },

  memberLabel(member) {
    return `${member.LdapID || member.ID}${member.Name ? ' (' + member.Name + ')' : ''}`;
  },

  memberOptions(selected = '') {
    const members = (ANP.state.data?.members || []).filter(member => member.Status === '사용');
    const list = [`<option value="">선택하세요.</option>`];
    members.forEach(member => {
      list.push(`<option value="${this.esc(member.ID)}" ${String(member.ID) === String(selected) ? 'selected' : ''}>${this.esc(this.memberLabel(member))}</option>`);
    });
    return list.join('');
  },

  topicOptions(selected = '') {
    return this.optionList(ANP.state.data?.topics || [], 'ID', 'Title', selected);
  },

  codeOptions(group, selected = '') {
    const rows = (ANP.state.data?.codes || [])
      .filter(code => code.Group === group && code.Enabled !== 'N')
      .sort((a, b) => Number(a.Order || 0) - Number(b.Order || 0));
    return this.optionList(rows, 'Value', 'Label', selected);
  },

  toolbar({ title, desc, filterKey, actionLabel = '', actionType = '' }) {
    return `<div class="toolbar"><div class="toolbar-title"><h2>${this.esc(title)}</h2>${desc ? `<p class="page-desc">${this.esc(desc)}</p>` : ''}</div><div class="toolbar-actions">${filterKey ? this.filterBox(filterKey) : ''}${actionLabel ? `<button class="btn btn-primary" data-add="${this.esc(actionType)}">${this.esc(actionLabel)}</button>` : ''}</div></div>`;
  },

  filterBox(key) {
    const value = ANP.state.filters[key] || '';
    return `<div class="filter-form"><input class="input filter-input" data-filter="${this.esc(key)}" value="${this.esc(value)}" placeholder="검색어를 입력하세요." /><button class="btn btn-tertiary" data-clear-filter="${this.esc(key)}">초기화</button></div>`;
  },

  bindFilters() {
    document.querySelectorAll('[data-filter]').forEach(el => {
      let composing = false;
      el.oncompositionstart = () => { composing = true; };
      el.oncompositionend = e => {
        composing = false;
        ANP.state.filters[e.target.dataset.filter] = e.target.value;
        ANP.app.render();
      };
      el.onkeydown = e => {
        if (e.key === 'Enter') {
          ANP.state.filters[e.target.dataset.filter] = e.target.value;
          ANP.app.render();
        }
      };
      el.oninput = e => {
        if (!composing) ANP.state.filters[e.target.dataset.filter] = e.target.value;
      };
    });

    document.querySelectorAll('[data-clear-filter]').forEach(btn => {
      btn.onclick = () => {
        ANP.state.filters[btn.dataset.clearFilter] = '';
        ANP.app.render();
      };
    });
  },

  applyFilter(rows, key, fields) {
    const query = String(ANP.state.filters[key] || '').trim().toLowerCase();
    if (!query) return rows || [];
    return (rows || []).filter(row => fields.some(field => String(row[field] || '').toLowerCase().includes(query)));
  },

  table(rows, columns, options = {}) {
    const config = typeof options === 'boolean' ? { actions: [] } : options;
    const actions = config.actions || [];
    const emptyLabel = this.esc(config.emptyLabel || '등록된 항목이 없습니다.');
    if (!rows || !rows.length) return `<div class="empty">${emptyLabel}</div>`;

    const colgroup = columns.map(col => `<col style="width:${col.width || 'auto'}">`).join('') + (actions.length ? '<col style="width:220px">' : '');
    const header = columns.map(col => `<th>${this.esc(col.label)}</th>`).join('') + (actions.length ? '<th>관리</th>' : '');
    const body = rows.map(row => {
      const cells = columns.map(col => `<td>${this.cell(row, col)}</td>`).join('');
      const actionId = row.ID ?? row.Key ?? '';
      const rowActions = actions.filter(action => !action.show || action.show(row));
      const actionCells = actions.length ? `<td class="td-actions">${rowActions.map(action => `<button class="btn btn-tertiary" data-action="${this.esc(action.key)}" data-id="${this.esc(actionId)}">${this.esc(action.label)}</button>`).join('')}</td>` : '';
      return `<tr>${cells}${actionCells}</tr>`;
    }).join('');

    return `<div class="table-wrap"><table class="data-table"><colgroup>${colgroup}</colgroup><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`;
  },

  cell(row, col) {
    const value = col.formatter ? col.formatter(row) : row[col.key];
    if (col.type === 'status') return this.badge(value);
    if (col.type === 'progress') return this.progress(value);

    const safe = this.esc(value || '');
    const clamp = col.multiline ? 'clamp-2' : 'clamp-1';
    const cellType = col.type === 'title' ? 'cell-title' : col.type === 'pre' ? 'cell-pre' : 'cell-text';
    return `<div class="cell ${cellType} ${clamp}" title="${safe}">${safe}</div>`;
  },

  formField({ id, label, type = 'text', value = '', required = false, options = '', placeholder = '입력하세요.', rows = 4 }) {
    const req = required ? '<b class="required">*</b>' : '';
    if (type === 'select') return `<label class="field"><span>${this.esc(label)} ${req}</span><select id="${id}" class="select">${options}</select></label>`;
    if (type === 'textarea') return `<label class="field"><span>${this.esc(label)} ${req}</span><textarea id="${id}" class="textarea" rows="${rows}" placeholder="${this.esc(placeholder)}">${this.esc(value)}</textarea></label>`;
    if (type === 'number') return `<label class="field"><span>${this.esc(label)} ${req}</span><input id="${id}" class="input" type="number" value="${this.esc(value)}" placeholder="${this.esc(placeholder)}" /></label>`;
    return `<label class="field"><span>${this.esc(label)} ${req}</span><input id="${id}" class="input" type="text" value="${this.esc(value)}" placeholder="${this.esc(placeholder)}" /></label>`;
  },

  collect(ids) {
    const out = {};
    ids.forEach(id => {
      const el = document.getElementById(id);
      out[id] = el ? el.value.trim() : '';
    });
    return out;
  },

  requireSession() {
    if (ANP.state.session.userId && ANP.state.session.writeKey) return true;
    this.toast('먼저 작성 정보를 설정하세요.', 'warning');
    ANP.app.openSession();
    return false;
  }
};
