window.ANP = window.ANP || {};
ANP.app = {
  async init() {
    document.getElementById('app-version').textContent = window.ANP_CONFIG?.APP_VERSION || 'v1.0.0-frontend-r1';
    document.getElementById('btn-open-session').onclick = () => this.openSession();
    document.getElementById('current-topic').onchange = e => { ANP.state.currentTopicId = e.target.value; this.render(); };
    await this.load();
  },
  async load() {
    try {
      const json = await ANP.api.request({ action: 'data' });
      ANP.state.data = json.data || {};
      this.applyDerivedFields();
      this.applySettings();
      this.renderTopicSelector();
      this.renderNav();
      this.render();
    } catch (e) {
      ANP.ui.toast(e.message || '데이터를 불러오지 못했습니다.', 'error');
      document.getElementById('content').innerHTML = `<div class="empty">${ANP.ui.esc(e.message || '연결 오류가 발생했습니다.')}</div>`;
    }
  },
  applyDerivedFields() {
    const members = ANP.state.data.members || [];
    const codeMap = Object.fromEntries((ANP.state.data.codes || []).map(c => [`${c.Group}:${c.Value}`, c.Label]));
    members.forEach(m => {
      m.LdapDisplay = `${m.LdapID || m.ID}${m.Name ? ' (' + m.Name + ')' : ''}`;
      m.RoleLabel = codeMap[`USER_ROLE:${m.Role}`] || m.Role;
    });
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
    const menus = (ANP.state.data?.menu || []).filter(m => m.Enabled !== 'N').sort((a,b)=>Number(a.Order||0)-Number(b.Order||0));
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
    document.getElementById('content').innerHTML = renderer.call(ANP.pages);
    ANP.ui.bindFilters();
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
