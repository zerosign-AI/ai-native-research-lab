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
    setTimeout(() => node.remove(), 2600);
  },

  dialog({ title, message, body = '', confirmText = '확인', cancelText = '취소', danger = false }) {
    return new Promise(resolve => {
      const root = document.getElementById('dialog-root');
      root.innerHTML = `
        <div class="dialog-backdrop" role="dialog" aria-modal="true">
          <div class="dialog">
            <h3>${this.esc(title || '확인')}</h3>
            ${message ? `<p class="page-desc">${this.esc(message)}</p>` : ''}
            ${body ? `<div class="dialog-body">${body}</div>` : ''}
            <div class="dialog-actions">
              <button class="btn btn-tertiary" data-dialog="cancel">${this.esc(cancelText)}</button>
              <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-dialog="confirm">${this.esc(confirmText)}</button>
            </div>
          </div>
        </div>`;
      root.querySelector('[data-dialog="cancel"]').onclick = () => { root.innerHTML = ''; resolve(false); };
      root.querySelector('[data-dialog="confirm"]').onclick = () => { root.innerHTML = ''; resolve(true); };
    });
  },

  modal({ title, body, confirmText = '저장', cancelText = '닫기', danger = false }) {
    return new Promise(resolve => {
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
      root.querySelector('[data-dialog="cancel"]').onclick = () => { root.innerHTML = ''; resolve(null); };
      root.querySelector('[data-dialog="confirm"]').onclick = () => resolve(root);
    });
  },

  metric(label, value, desc = '') {
    return `<div class="card metric"><div class="metric-label">${this.esc(label)}</div><div class="metric-value">${this.esc(value)}</div>${desc ? `<div class="metric-desc">${this.esc(desc)}</div>` : ''}</div>`;
  },

  badge(value) {
    const v = String(value || '-');
    const key = v.toLowerCase().replaceAll(' ', '');
    let type = 'info';
    if (['완료','승인','accepted','done','active','사용'].includes(key)) type = 'success';
    if (['검토','진행중','inprogress','review','open','열림'].includes(key)) type = 'warning';
    if (['삭제','반려','오류','deprecated','inactive','미사용'].includes(key)) type = 'danger';
    return `<span class="badge ${type}">${this.esc(v)}</span>`;
  },

  progress(value) {
    const n = Math.max(0, Math.min(100, parseFloat(String(value || '0').replace('%','')) || 0));
    return `<div>${n}%</div><div class="progress"><div style="width:${n}%"></div></div>`;
  },

  optionList(rows, valueKey, labelKey, selected = '', first = '선택하세요.') {
    const list = [`<option value="">${this.esc(first)}</option>`];
    (rows || []).forEach(r => {
      const value = r[valueKey] ?? '';
      const label = r[labelKey] ?? value;
      list.push(`<option value="${this.esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${this.esc(label)}</option>`);
    });
    return list.join('');
  },

  table(rows, columns, actions = true) {
    if (!rows || !rows.length) return `<div class="empty">등록된 항목이 없습니다.</div>`;
    return `<div class="table-wrap"><table><thead><tr>${columns.map(c => `<th>${this.esc(c.label)}</th>`).join('')}${actions ? '<th>관리</th>' : ''}</tr></thead><tbody>${rows.map(row => `<tr>${columns.map(c => `<td>${this.cell(row, c)}</td>`).join('')}${actions ? `<td class="td-actions"><button class="btn btn-tertiary" data-edit="${this.esc(row.ID || row.Id || row['ID'])}">수정</button> <button class="btn btn-tertiary" data-delete="${this.esc(row.ID || row.Id || row['ID'])}">삭제</button></td>` : ''}</tr>`).join('')}</tbody></table></div>`;
  },

  cell(row, col) {
    const value = row[col.key];
    if (col.type === 'status') return this.badge(value);
    if (col.type === 'progress') return this.progress(value);
    if (col.type === 'pre') return `<div class="preline">${this.esc(value)}</div>`;
    return this.esc(value || '');
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
  }
};
