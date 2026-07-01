window.ANP = window.ANP || {};
ANP.ui = {
  esc(value) {
    return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  },
  toast(message, type='info') {
    const root = document.getElementById('toast-root');
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.textContent = message;
    root.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  },
  closeModal(){ document.getElementById('dialog-root').innerHTML = ''; },
  modal({ title, body, confirmText='저장', cancelText='닫기', danger=false }) {
    const root = document.getElementById('dialog-root');
    root.innerHTML = `<div class="dialog-backdrop" role="dialog" aria-modal="true"><div class="dialog"><h3>${this.esc(title)}</h3><div class="dialog-body">${body}</div><div class="dialog-actions"><button class="btn btn-tertiary" data-dialog="cancel">${this.esc(cancelText)}</button><button class="btn ${danger?'btn-danger':'btn-primary'}" data-dialog="confirm">${this.esc(confirmText)}</button></div></div></div>`;
    root.querySelector('[data-dialog="cancel"]').onclick = () => this.closeModal();
    return root;
  },
  metric(label, value, desc='') {
    return `<div class="card metric"><div class="metric-label">${this.esc(label)}</div><div class="metric-value">${this.esc(value)}</div>${desc ? `<div class="metric-desc">${this.esc(desc)}</div>` : ''}</div>`;
  },
  badge(value) {
    const v = String(value || '-');
    const key = v.toLowerCase().replaceAll(' ', '');
    let type = 'info';
    if (['완료','승인','accepted','done','active','사용'].includes(key)) type = 'success';
    if (['검토','진행중','inprogress','review','open','열림','전체'].includes(key)) type = 'warning';
    if (['삭제','반려','오류','deprecated','inactive','미사용'].includes(key)) type = 'danger';
    return `<span class="badge ${type}" title="${this.esc(v)}">${this.esc(v)}</span>`;
  },
  progress(value) {
    const n = Math.max(0, Math.min(100, parseFloat(String(value || '0').replace('%','')) || 0));
    return `<div class="cell-text">${n}%</div><div class="progress"><div style="width:${n}%"></div></div>`;
  },
  optionList(rows, valueKey, labelKey, selected='', first='선택하세요.') {
    const list = [`<option value="">${this.esc(first)}</option>`];
    (rows || []).forEach(r => {
      if (r.Enabled === 'N' || r.Status === '미사용') return;
      const value = r[valueKey] ?? '';
      const label = r[labelKey] ?? value;
      list.push(`<option value="${this.esc(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${this.esc(label)}</option>`);
    });
    return list.join('');
  },
  memberLabel(m){ return `${m.LdapID || m.ID}${m.Name ? ' (' + m.Name + ')' : ''}`; },
  memberOptions(selected='') {
    const members = (ANP.state.data?.members || []).filter(m => m.Status === '사용');
    const list = [`<option value="">선택하세요.</option>`];
    members.forEach(m => list.push(`<option value="${this.esc(m.ID)}" ${String(m.ID)===String(selected)?'selected':''}>${this.esc(this.memberLabel(m))}</option>`));
    return list.join('');
  },
  topicOptions(selected='') { return this.optionList(ANP.state.data?.topics || [], 'ID', 'Title', selected); },
  codeOptions(group, selected='') {
    const rows = (ANP.state.data?.codes || []).filter(c => c.Group === group && c.Enabled !== 'N').sort((a,b) => Number(a.Order||0)-Number(b.Order||0));
    return this.optionList(rows, 'Value', 'Label', selected);
  },
  toolbar({ title, desc, filterKey, actionLabel='', actionType='' }) {
    return `<div class="toolbar"><div class="toolbar-title"><h2>${this.esc(title)}</h2>${desc ? `<p class="page-desc">${this.esc(desc)}</p>` : ''}</div><div class="toolbar-actions">${filterKey ? this.filterBox(filterKey) : ''}${actionLabel ? `<button class="btn btn-primary" data-add="${this.esc(actionType)}">${this.esc(actionLabel)}</button>` : ''}</div></div>`;
  },
  filterBox(key) {
    const value = ANP.state.filters[key] || '';
    return `<div class="filter-form"><input class="input filter-input" data-filter="${this.esc(key)}" value="${this.esc(value)}" placeholder="검색어를 입력하세요." /><button class="btn btn-tertiary" data-clear-filter="${this.esc(key)}">초기화</button></div>`;
  },
  bindFilters() {
  document.querySelectorAll('[data-filter]').forEach(el => {
    let composing = false;

    el.oncompositionstart = () => {
      composing = true;
    };

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
      if (composing) return;
      ANP.state.filters[e.target.dataset.filter] = e.target.value;
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
    const q = String(ANP.state.filters[key] || '').trim().toLowerCase();
    if (!q) return rows || [];
    return (rows || []).filter(r => fields.some(f => String(r[f] || '').toLowerCase().includes(q)));
  },
  table(rows, columns, actions=true) {
    if (!rows || !rows.length) return `<div class="empty">등록된 항목이 없습니다.</div>`;
    return `<div class="table-wrap"><table class="data-table"><colgroup>${columns.map(c=>`<col style="width:${c.width || 'auto'}">`).join('')}${actions?'<col style="width:132px">':''}</colgroup><thead><tr>${columns.map(c=>`<th>${this.esc(c.label)}</th>`).join('')}${actions?'<th>관리</th>':''}</tr></thead><tbody>${rows.map(row=>`<tr>${columns.map(c=>`<td>${this.cell(row,c)}</td>`).join('')}${actions?`<td class="td-actions"><button class="btn btn-tertiary" data-edit="${this.esc(row.ID)}">수정</button></td>`:''}</tr>`).join('')}</tbody></table></div>`;
  },
  cell(row, col) {
    const value = row[col.key];
    if (col.type === 'status') return this.badge(value);
    if (col.type === 'progress') return this.progress(value);
    if (col.type === 'pre') return `<div class="cell-pre" title="${this.esc(value)}">${this.esc(value)}</div>`;
    if (col.type === 'title') return `<div class="td-title" title="${this.esc(value)}">${this.esc(value)}</div>`;
    return `<div class="cell-text" title="${this.esc(value)}">${this.esc(value || '')}</div>`;
  },
  formField({ id, label, type='text', value='', required=false, options='', placeholder='입력하세요.', rows=4 }) {
    const req = required ? '<b class="required">*</b>' : '';
    if (type === 'select') return `<label class="field"><span>${this.esc(label)} ${req}</span><select id="${id}" class="select">${options}</select></label>`;
    if (type === 'textarea') return `<label class="field"><span>${this.esc(label)} ${req}</span><textarea id="${id}" class="textarea" rows="${rows}" placeholder="${this.esc(placeholder)}">${this.esc(value)}</textarea></label>`;
    if (type === 'number') return `<label class="field"><span>${this.esc(label)} ${req}</span><input id="${id}" class="input" type="number" value="${this.esc(value)}" placeholder="${this.esc(placeholder)}" /></label>`;
    return `<label class="field"><span>${this.esc(label)} ${req}</span><input id="${id}" class="input" type="text" value="${this.esc(value)}" placeholder="${this.esc(placeholder)}" /></label>`;
  },
  collect(ids) {
    const out = {};
    ids.forEach(id => { const el = document.getElementById(id); out[id] = el ? el.value.trim() : ''; });
    return out;
  },
  requireSession() {
    if (ANP.state.session.userId && ANP.state.session.writeKey) return true;
    this.toast('먼저 작성 정보를 설정하세요.', 'warning');
    ANP.app.openSession();
    return false;
  }
};
