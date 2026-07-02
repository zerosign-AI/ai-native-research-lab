window.ANP = window.ANP || {};
ANP.app = {
  async init() {
    document.getElementById('app-version').textContent = window.ANP_CONFIG?.APP_VERSION || window.ANP_VERSION || '-';
    document.getElementById('btn-open-session').onclick = () => this.openSession();
    document.getElementById('current-topic').onchange = e => { ANP.state.currentTopicId = e.target.value; this.render(); };
    await this.load();
  },
  async load({ silent = false } = {}) {
    try {
      const json = await ANP.api.request({ action: 'data' });
      ANP.state.data = json.data || {};
      this.applyDerivedFields();
      this.applySettings();
      this.renderTopicSelector();
      this.renderNav();
      this.render();
    } catch (e) {
      if (silent) {
        ANP.ui.toast('최신 데이터 동기화에 실패했습니다. 새로고침해 주세요.', 'warning');
        return;
      }
      ANP.ui.toast(e.message || '데이터를 불러오지 못했습니다.', 'error');
      document.getElementById('content').innerHTML = `<div class="empty">${ANP.ui.esc(e.message || '연결 오류가 발생했습니다.')}</div>`;
    }
  },
  refreshAfterMutation() {
    this.render();
    this.load({ silent: true });
  },
  applyDerivedFields() {
    const data = ANP.state.data || {};
    const members = data.members || [];
    const codeMap = Object.fromEntries((data.codes || []).map(c => [`${c.Group}:${c.Value}`, c.Label]));
    const memberLabel = member => member ? `${member.LdapID || member.ID}${member.Name ? ' (' + member.Name + ')' : ''}` : '';
    const membersById = Object.fromEntries(members.map(member => [member.ID, member]));
    members.forEach(m => {
      m.LdapDisplay = memberLabel(m);
      m.RoleLabel = codeMap[`USER_ROLE:${m.Role}`] || m.Role;
    });
    ['topics', 'roadmap', 'decisions', 'opinions', 'frameworks'].forEach(key => (data[key] || []).forEach(row => {
      if (row.OwnerID) row.OwnerName = memberLabel(membersById[row.OwnerID]) || row.OwnerID;
      if (row.AuthorID) row.AuthorName = memberLabel(membersById[row.AuthorID]) || row.AuthorID;
    }));
  },
  applySettings() {
    const settings = ANP.state.data?.settings || [];
    const map = Object.fromEntries(settings.map(s => [s.Key, s.Value]));
    document.title = map.SystemName || 'AI Native Platform';
    document.getElementById('brand-title').textContent = map.SystemName || 'AI Native Platform';
    document.getElementById('brand-subtitle').textContent = map.AppName || 'Research Lab';
  },
  renderTopicSelector() {
    const select = document.getElementById('current-topic');
    const current = ANP.state.currentTopicId;
    select.innerHTML = `<option value="">전체 연구과제</option>` + (ANP.state.data?.topics || []).map(t => `<option value="${ANP.ui.esc(t.ID)}" ${t.ID === current ? 'selected' : ''}>${ANP.ui.esc(t.Title)}</option>`).join('');
  },
  renderNav() {
    const nav = document.getElementById('nav');
    const menus = (ANP.state.data?.menu || []).filter(m => m.Enabled !== 'N').map(m => {
      const isLab = m.ID === 'lab' || m.ID === 'workspace' || m.Label === '연구 워크스페이스';
      return isLab ? { ...m, ID:'lab', Label:'연구실' } : m;
    }).filter((m, index, list) => list.findIndex(item => item.ID === m.ID) === index);
    if (!menus.some(m => m.ID === 'lab')) {
      menus.push({ ID:'lab', Label:'연구실', Enabled:'Y', Order:1.5, Role:'member' });
    }
    menus.sort((a,b)=>Number(a.Order||0)-Number(b.Order||0));
    nav.innerHTML = menus.map(m => `<button class="${m.ID === ANP.state.currentPage ? 'active' : ''}" data-page="${ANP.ui.esc(m.ID)}"><span>${ANP.ui.esc(m.Label)}</span></button>`).join('');
    nav.querySelectorAll('[data-page]').forEach(btn => { btn.onclick = () => { ANP.state.currentPage = btn.dataset.page; this.renderNav(); this.render(); }; });
  },
  render() {
    const page = ANP.state.currentPage;
    const meta = ANP.constants.pageMeta[page] || ['페이지',''];
    document.getElementById('page-title').textContent = meta[0];
    document.getElementById('page-desc').textContent = meta[1];
    document.getElementById('page-eyebrow').textContent = 'AI Native Platform';
    const renderer = ANP.pages[page] || ANP.pages.dashboard;
    const content = document.getElementById('content');
    content.innerHTML = `${renderer.call(ANP.pages)}${ANP.ui.coachButton(page)}`;
    ANP.ui.bindFilters();
    ANP.ui.bindCoach();
    ANP.pages.bind?.();
  },
  openSession() {
    const template = document.getElementById('session-template').innerHTML;
    const root = ANP.ui.modal({ title:'작성 정보 설정', body:template, confirmText:'저장' });
    const user = root.querySelector('#session-user');
    user.innerHTML = ANP.ui.memberOptions(ANP.state.session.userId);
    root.querySelector('#session-key').value = ANP.state.session.writeKey || '';
    root.querySelector('[data-dialog="confirm"]').onclick = () => {
      const userId = root.querySelector('#session-user').value;
      const writeKey = root.querySelector('#session-key').value.trim();
      if (!userId || !writeKey) { ANP.ui.toast('작성자와 팀 암호를 입력하세요.', 'warning'); return; }
      ANP.state.session.userId = userId;
      ANP.state.session.writeKey = writeKey;
      localStorage.setItem('anp_user_id', userId);
      localStorage.setItem('anp_write_key', writeKey);
      ANP.ui.closeModal();
      ANP.ui.toast('작성 정보를 저장했습니다.', 'success');
    };
  }
};
document.addEventListener('DOMContentLoaded', () => ANP.app.init());
