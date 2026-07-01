ANP.ui = {
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
    setTimeout(() => node.remove(), 2800);
  },

  modal({ title, body, confirmText = '저장', cancelText = '닫기', danger = false }) {
    const root = document.getElementById('dialog-root');
    root.innerHTML = `
      <div class="dialog-backdrop" role="dialog" aria-modal="true">
        <div class="dialog">
          <h3>${this.esc(title)}</h3>
          <div class="dialog-body">${body}</div>
          <div class="dialog-actions">
            <button class="btn btn-tertiary" data-dialog="cancel">${this.esc(cancelText)}</button>
            <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-dialog="confirm">${this.esc(confirmText)}</button>
          </div>
        </div>
      </div>`;
    root.querySelector('[data-dialog="cancel"]').onclick = () => { root.innerHTML = ''; };
    return root;
  },

  closeModal() {
    document.getElementById('dialog-root').innerHTML = '';
  },

  async confirm({ title = '확인', message = '', confirmText = '확인', danger = false }) {
    return new Promise(resolve => {
      const root = this.modal({ title, body: `<p class="page-desc">${this.esc(message)}</p>`, confirmText, cancelText: '취소', danger });
      root.querySelector('[data-dialog="cancel"]').onclick = () => { this.closeModal(); resolve(false); };
      root.querySelector('[data-dialog="confirm"]').onclick = () => { this.closeModal(); resolve(true); };
    });
  },

  metric(label, value, desc = '') {
    return `<div class="card metric"><div class="metric-label">${this.esc(label)}</div><div class="metric-value" title="${this.esc(value)}">${this.esc(value)}</div>${desc ? `<div class="metric-desc" title="${this.esc(desc)}">${this.esc(desc)}</div>` : ''}</div>`;
  },

  badge(value) {
    const v = String(value || '-');
    let type = 'info';
    if (['완료','승인','사용','active','done','accepted'].includes(v.toLowerCase()) || ['완료','승인','사용'].includes(v)) type = 'success';
    if (['검토','진행중','열림','초안'].includes(v)) type = 'warning';
    if (['삭제','반려','오류','미사용'].includes(v)) type = 'danger';
    return `<span class="badge ${type}" title="${this.esc(v)}">${this.esc(v)}</span>`;
  },

  progress(value) {
    const n = Math.max(0, Math.min(100, parseFloat(String(value || '0').replace('%','')) || 0));
    return `<div class="td-compact">${n}%</div><div class="progress"><div style="width:${n}%"></div></div>`;
  },

  optionList(rows, valueKey, labelKey, selected = '', first = '선택하세요.', formatter) {
    const list = [`<option value="">${this.esc(first)}</option>`];
    (rows || [])
      .filter(r => r.Enabled !== 'N' && r.Status !== '미사용')
      .forEach(r => {
        const value = r[valueKey] ?? '';
        const label = formatter ? formatter(r) : (r[labelKey] ?? value);
        list.push(`<option value="${this.esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${this.esc(label)}</option>`);
      });
    return list.join('');
  },

  memberOptions(selected = '') {
    const members = ANP.state.data?.members || [];
    return this.optionList(members, 'ID', 'Name', selected, '선택하세요.', m => `${m.LdapID || m.ID} (${m.Name || '-'})`);
  },

  topicOptions(selected = '') {
    return this.optionList(ANP.state.data?.topics || [], 'ID', 'Title', selected, '선택하세요.');
  },

  codeOptions(group, selected = '') {
    const rows = (ANP.state.data?.codes || [])
      .filter(c => c.Group === group && c.Enabled !== 'N')
      .sort((a,b) => Number(a.Order || 0) - Number(b.Order || 0));
    return this.optionList(rows, 'Value', 'Label', selected, '선택하세요.');
  },

  filterBox(key, placeholder = '목록에서 검색하세요.') {
    const v = ANP.state.filters[key] || '';
    return `<div class="filter-form" data-filter-form="${this.esc(key)}">
      <input class="input filter-input" data-filter="${this.esc(key)}" value="${this.esc(v)}" placeholder="${this.esc(placeholder)}" />
      <button class="btn btn-tertiary" type="button" data-filter-clear="${this.esc(key)}">초기화</button>
    </div>`;
  },

  applyFilter(rows, key, fields) {
    const q = String(ANP.state.filters[key] || '').trim().toLowerCase();
    if (!q) return rows || [];
    return (rows || []).filter(row => fields.some(f => String(row[f] || '').toLowerCase().includes(q)));
  },

  bindFilters() {
    document.querySelectorAll('[data-filter]').forEach(input => {
      input.oninput = e => {
        ANP.state.filters[input.dataset.filter] = e.target.value;
        ANP.app.render();
        const next = document.querySelector(`[data-filter="${input.dataset.filter}"]`);
        if (next) {
          next.focus();
          next.setSelectionRange(next.value.length, next.value.length);
        }
      };
    });
    document.querySelectorAll('[data-filter-clear]').forEach(btn => {
      btn.onclick = () => {
        ANP.state.filters[btn.dataset.filterClear] = '';
        ANP.app.render();
      };
    });
  },

  toolbar({ title, desc = '', filterKey = '', actionLabel = '', actionType = '' }) {
    return `<div class="toolbar">
      <div class="toolbar-title">
        <h2 title="${this.esc(title)}">${this.esc(title)}</h2>
        ${desc ? `<p class="page-desc">${this.esc(desc)}</p>` : ''}
      </div>
      <div class="toolbar-right">
        ${filterKey ? this.filterBox(filterKey) : ''}
        ${actionLabel ? `<button class="btn btn-primary" data-add="${this.esc(actionType)}">${this.esc(actionLabel)}</button>` : ''}
      </div>
    </div>`;
  },

  table(rows, columns, actions = false) {
    if (!rows || !rows.length) return `<div class="empty">등록된 항목이 없습니다.</div>`;
    return `<div class="table-wrap"><table class="data-table"><thead><tr>${columns.map(c => `<th style="width:${c.width || 'auto'}">${this.esc(c.label)}</th>`).join('')}${actions ? '<th class="td-actions">관리</th>' : ''}</tr></thead><tbody>${rows.map(row => `<tr>${columns.map(c => `<td>${this.cell(row, c)}</td>`).join('')}${actions ? `<td class="td-actions"><button class="btn btn-tertiary" data-edit="${this.esc(row.ID || '')}">수정</button></td>` : ''}</tr>`).join('')}</tbody></table></div>`;
  },

  cell(row, col) {
    const value = row[col.key];
    if (col.type === 'status') return this.badge(value);
    if (col.type === 'progress') return this.progress(value);
    if (col.type === 'pre') return `<div class="td-pre" title="${this.esc(value)}">${this.esc(value)}</div>`;
    if (col.type === 'title') return `<div class="td-title" title="${this.esc(value)}">${this.esc(value || '')}</div>`;
    return `<div class="cell-text" title="${this.esc(value)}">${this.esc(value || '')}</div>`;
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
    if (!ANP.state.session.userId || !ANP.state.session.writeKey) {
      this.toast('우측 상단 작성 정보에서 작성자와 팀 암호를 먼저 저장하세요.', 'warning');
      ANP.app.openSession();
      return false;
    }
    return true;
  }
};
