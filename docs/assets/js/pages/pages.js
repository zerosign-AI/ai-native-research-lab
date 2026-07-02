window.ANP = window.ANP || {};
ANP.pages = {
  scoped(rows) {
    const id = ANP.state.currentTopicId;
    return id ? (rows || []).filter(row => row.TopicID === id || row.ID === id) : (rows || []);
  },

  dashboard() {
    const model = this.dashboardModel();
    return `<div class="section-stack">${this.dashboardHero(model)}${this.dashboardMetrics(model)}${this.dashboardCurrentWork(model)}${this.dashboardRecentGrid(model)}${this.dashboardQuickActions()}</div>`;
  },

  dashboardModel() {
    const data = ANP.state.data || {};
    const selectedTopicId = ANP.state.currentTopicId;
    const selectedTopic = (data.topics || []).find(topic => topic.ID === selectedTopicId);
    const topics = selectedTopic ? [selectedTopic] : (data.topics || []);
    const roadmap = this.scoped(data.roadmap || []);
    const decisions = this.scoped(data.decisions || []);
    const opinions = this.scoped(data.opinions || []);
    const frameworks = this.scoped(data.frameworks || []);
    const done = roadmap.filter(item => item.Status === '완료').length;
    const inProgress = roadmap.filter(item => item.Status === '진행중').length;
    const avg = roadmap.length ? Math.round(roadmap.reduce((sum, item) => sum + (Number(item.Progress) || 0), 0) / roadmap.length) : 0;
    const currentRoadmap = roadmap.find(item => item.Status === '진행중') || roadmap[0] || null;
    return { selectedTopic, topics, roadmap, decisions, opinions, frameworks, done, inProgress, avg, currentRoadmap };
  },

  dashboardHero(model) {
    const topicTitle = model.selectedTopic?.Title || '전체 연구과제';
    const topicDesc = model.selectedTopic?.Description || '등록된 모든 연구과제를 통합해서 봅니다.';
    const roadmapTitle = model.currentRoadmap?.Title || '-';
    const roadmapNote = model.currentRoadmap?.Note || '진행 중인 로드맵이 없습니다.';
    return `<div class="card dashboard-hero"><div class="card-head"><div><h2>현재 연구 상태</h2><p class="page-desc">${ANP.ui.esc(topicTitle)} 기준으로 현재 진행 상황을 확인합니다.</p></div><div>${ANP.ui.badge(model.selectedTopic?.Status || '전체')}</div></div><div class="dashboard-hero-grid"><div><div class="summary-label">현재 연구과제</div><div class="summary-value" title="${ANP.ui.esc(topicTitle)}">${ANP.ui.esc(topicTitle)}</div><div class="summary-desc">${ANP.ui.esc(topicDesc)}</div></div><div><div class="summary-label">현재 로드맵 항목</div><div class="summary-value" title="${ANP.ui.esc(roadmapTitle)}">${ANP.ui.esc(roadmapTitle)}</div><div class="summary-desc">${ANP.ui.esc(roadmapNote)}</div></div><div><div class="summary-label">로드맵 진행률</div><div class="summary-value">${model.avg}%</div>${ANP.ui.progress(model.avg)}<div class="summary-desc">${model.done}/${model.roadmap.length} 완료 · 진행중 ${model.inProgress}</div></div></div></div>`;
  },

  dashboardMetrics(model) {
    return `<div class="grid cols-4">${ANP.ui.metric('연구과제', model.topics.length, model.selectedTopic ? '선택된 연구과제' : '등록된 전체 연구과제')}${ANP.ui.metric('로드맵', model.roadmap.length, `완료 ${model.done} · 진행중 ${model.inProgress}`)}${ANP.ui.metric('의사결정', model.decisions.length, '선택 범위 기준')}${ANP.ui.metric('의견', model.opinions.length, '선택 범위 기준')}</div>`;
  },

  dashboardCurrentWork(model) {
    const roadmapCard = model.currentRoadmap ? `<div class="dashboard-item"><div class="td-title" title="${ANP.ui.esc(model.currentRoadmap.Title)}">${ANP.ui.esc(model.currentRoadmap.Title)}</div><div class="page-desc td-pre">${ANP.ui.esc(model.currentRoadmap.Note || '')}</div><div class="dashboard-item-footer">${ANP.ui.badge(model.currentRoadmap.Status)}<span>${ANP.ui.esc(model.currentRoadmap.OwnerName || '-')}</span></div>${ANP.ui.progress(model.currentRoadmap.Progress)}</div>` : `<div class="empty">등록된 로드맵이 없습니다.</div>`;
    return `<div class="grid cols-2"><div class="card"><div class="card-head"><h2>현재 로드맵</h2></div>${roadmapCard}</div><div class="card"><div class="card-head"><h2>최근 프레임워크</h2></div>${this.recent(model.frameworks, { title:'Title', body:'Content', meta:row => [row.TopicTitle, row.Category, row.Version ? 'v' + row.Version : '', row.UpdatedAt] })}</div></div>`;
  },

  dashboardRecentGrid(model) {
    return `<div class="grid cols-2"><div class="card"><div class="card-head"><h2>최근 의사결정</h2></div>${this.recent(model.decisions, { title:'Title', body:'Decision', meta:row => [row.TopicTitle, row.AuthorName, row.CreatedAt] })}</div><div class="card"><div class="card-head"><h2>최근 의견</h2></div>${this.recent(model.opinions, { title:'Title', body:'Opinion', meta:row => [row.TopicTitle, row.AuthorName, row.CreatedAt] })}</div></div>`;
  },

  dashboardQuickActions() {
    return `<div class="card"><div class="card-head"><div><h2>다음 작업</h2><p class="page-desc">현재 로드맵 항목에서 팀이 이어서 작성하거나 검토할 항목입니다.</p></div></div><div class="quick-actions"><button class="btn btn-primary" data-add="opinion">의견 등록</button><button class="btn btn-secondary" data-add="decision">의사결정 등록</button><button class="btn btn-tertiary" data-add="roadmap">로드맵 추가</button><button class="btn btn-tertiary" data-add="framework">프레임워크 추가</button></div></div>`;
  },

  recent(rows, config) {
    if (!rows.length) return `<div class="empty">등록된 항목이 없습니다.</div>`;
    return rows.slice(0, 5).map(row => {
      const title = row[config.title] || '-';
      const body = row[config.body] || '';
      const meta = (config.meta?.(row) || []).filter(Boolean).map(item => ANP.ui.esc(item)).join(' · ');
      return `<div class="list-card"><div class="list-card-head"><div class="td-title" title="${ANP.ui.esc(title)}">${ANP.ui.esc(title)}</div>${ANP.ui.badge(row.Status)}</div><p class="page-desc" title="${ANP.ui.esc(body)}">${ANP.ui.esc(body)}</p>${meta ? `<div class="list-card-meta">${meta}</div>` : ''}</div>`;
    }).join('');
  },

  topics() {
    const rows = ANP.ui.applyFilter(ANP.state.data?.topics || [], 'topics', ['Title', 'Description', 'Status', 'OwnerName']);
    return `<div class="section-stack"><div class="card">${ANP.ui.toolbar({ title:'연구과제 목록', desc:'여러 연구과제를 관리합니다.', filterKey:'topics', actionLabel:'연구과제 추가', actionType:'topic' })}${ANP.ui.table(rows, [{ key:'Title', label:'제목', type:'title', width:'24%' }, { key:'Description', label:'설명', type:'pre', width:'36%' }, { key:'OwnerName', label:'담당자', width:'14%' }, { key:'Status', label:'상태', type:'status', width:'12%' }, { key:'UpdatedAt', label:'수정일', width:'14%' }], this.detailOptions('topics'))}</div></div>`;
  },

  roadmap() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.roadmap || []), 'roadmap', ['Title', 'TopicTitle', 'OwnerName', 'Status', 'Note']);
    return `<div class="section-stack"><div class="card">${ANP.ui.toolbar({ title:'로드맵', desc:'로드맵 항목과 담당자를 관리합니다.', filterKey:'roadmap', actionLabel:'로드맵 추가', actionType:'roadmap' })}${ANP.ui.table(rows, [{ key:'TopicTitle', label:'연구과제', type:'title', width:'22%' }, { key:'Title', label:'로드맵 항목', type:'title', width:'20%' }, { key:'Status', label:'상태', type:'status', width:'10%' }, { key:'Progress', label:'진행률', type:'progress', width:'12%' }, { key:'OwnerName', label:'담당자', width:'12%' }, { key:'Note', label:'메모', type:'pre', width:'24%' }], this.detailOptions('roadmap'))}</div></div>`;
  },

  opinion() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.opinions || []), 'opinion', ['Title', 'Opinion', 'AuthorName', 'TopicTitle', 'Status']);
    return `<div class="section-stack"><div class="card">${ANP.ui.toolbar({ title:'의견', desc:'팀원 의견을 기록합니다.', filterKey:'opinion', actionLabel:'의견 등록', actionType:'opinion' })}${ANP.ui.table(rows, [{ key:'TopicTitle', label:'연구과제', type:'title', width:'20%' }, { key:'Title', label:'제목', type:'title', width:'18%' }, { key:'Opinion', label:'의견', type:'pre', width:'32%' }, { key:'AuthorName', label:'작성자', width:'10%' }, { key:'Status', label:'상태', type:'status', width:'8%' }, { key:'CreatedAt', label:'작성일', width:'12%' }], this.detailOptions('opinion'))}</div></div>`;
  },

  decision() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.decisions || []), 'decision', ['Title', 'Decision', 'Reason', 'AuthorName', 'TopicTitle', 'Status']);
    return `<div class="section-stack"><div class="card">${ANP.ui.toolbar({ title:'의사결정', desc:'작은 의사결정을 축적합니다.', filterKey:'decision', actionLabel:'의사결정 등록', actionType:'decision' })}${ANP.ui.table(rows, [{ key:'TopicTitle', label:'연구과제', type:'title', width:'18%' }, { key:'Title', label:'제목', type:'title', width:'18%' }, { key:'Decision', label:'결정', type:'pre', width:'24%' }, { key:'Reason', label:'이유', type:'pre', width:'22%' }, { key:'AuthorName', label:'작성자', width:'8%' }, { key:'Status', label:'상태', type:'status', width:'10%' }], this.detailOptions('decision'))}</div></div>`;
  },

  framework() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.frameworks || []), 'framework', ['Category', 'Title', 'Content', 'TopicTitle', 'Status']);
    return `<div class="section-stack"><div class="card">${ANP.ui.toolbar({ title:'프레임워크', desc:'합의된 구조를 관리합니다.', filterKey:'framework', actionLabel:'프레임워크 추가', actionType:'framework' })}${ANP.ui.table(rows, [{ key:'TopicTitle', label:'연구과제', type:'title', width:'18%' }, { key:'Category', label:'분류', width:'12%' }, { key:'Title', label:'제목', type:'title', width:'18%' }, { key:'Content', label:'내용', type:'pre', width:'34%' }, { key:'Status', label:'상태', type:'status', width:'8%' }, { key:'Version', label:'버전', width:'10%' }], this.detailOptions('framework'))}</div></div>`;
  },

  settings() {
    const rows = ANP.ui.applyFilter(ANP.state.data?.settings || [], 'settings', ['Key', 'Value', 'Description']);
    return `<div class="section-stack"><div class="card">${ANP.ui.toolbar({ title:'설정', desc:'시스템 설정을 관리합니다.', filterKey:'settings' })}${ANP.ui.table(rows, [{ key:'Key', label:'설정키', type:'title', width:'20%' }, { key:'Value', label:'값', type:'title', width:'28%' }, { key:'Description', label:'설명', type:'pre', width:'34%' }, { key:'UpdatedAt', label:'수정일', width:'18%' }], this.detailOptions('settings'))}</div></div>`;
  },

  members() {
    const rows = ANP.ui.applyFilter(ANP.state.data?.members || [], 'members', ['LdapID', 'Name', 'Email', 'RoleLabel', 'Status']);
    return `<div class="section-stack">${this.permissionMatrix()}<div class="card">${ANP.ui.toolbar({ title:'권한관리', desc:'사용자와 역할을 관리합니다. 사번(ID)은 내부키로 사용하며 목록에는 노출하지 않습니다.', filterKey:'members', actionLabel:'사용자 추가', actionType:'member' })}${ANP.ui.table(rows, [{ key:'LdapDisplay', label:'LdapID (이름)', type:'title', width:'22%' }, { key:'Email', label:'이메일', width:'24%' }, { key:'Department', label:'부서', width:'14%' }, { key:'Team', label:'팀', width:'14%' }, { key:'RoleLabel', label:'역할', width:'12%' }, { key:'Status', label:'상태', type:'status', width:'14%' }], this.detailOptions('members'))}</div></div>`;
  },

  permissionMatrix() {
    const rows = [
      ['대시보드', '조회', '조회', '조회'],
      ['연구과제', '조회', '조회', '조회/추가/수정/삭제'],
      ['로드맵', '조회', '조회', '조회/추가/수정/삭제'],
      ['의견', '조회', '조회/추가/본인 수정·삭제', '조회/추가/수정/삭제'],
      ['의사결정', '조회', '조회', '조회/추가/수정/삭제'],
      ['프레임워크', '조회', '조회', '조회/추가/수정/삭제'],
      ['설정', '조회', '조회', '조회'],
      ['권한관리', '조회', '조회', '조회/사용자 추가·수정·삭제']
    ];
    const body = rows.map(row => `<tr><th>${ANP.ui.esc(row[0])}</th><td>${ANP.ui.esc(row[1])}</td><td>${ANP.ui.esc(row[2])}</td><td>${ANP.ui.esc(row[3])}</td></tr>`).join('');
    return `<div class="card permission-card"><div class="card-head"><div><h2>권한 매트릭스</h2><p class="page-desc">역할별 메뉴 접근과 작성/수정/삭제 가능 범위입니다.</p></div></div><div class="permission-table-wrap"><table class="permission-table"><thead><tr><th>메뉴</th><th>viewer</th><th>member</th><th>admin</th></tr></thead><tbody>${body}</tbody></table></div><p class="help-text">실제 변경 권한은 Apps Script에서 팀 암호, 사용자 상태, 역할 기준으로 최종 검증합니다.</p></div>`;
  },

  bind() {
    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.onclick = () => this.openForm(btn.dataset.add);
    });
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.onclick = () => this.handleAction(btn.dataset.action, btn.dataset.id);
    });
  },

  detailOptions(type) {
    return {
      actions: [
        { key:`detail:${type}`, label:'상세' },
        { key:`edit:${type}`, label:'수정', show:row => this.canMutate(type, row) },
        { key:`delete:${type}`, label:'삭제', show:row => this.canMutate(type, row) }
      ]
    };
  },

  currentUser() {
    const userId = ANP.state.session.userId;
    return (ANP.state.data?.members || []).find(member => String(member.ID) === String(userId));
  },

  formType(type) {
    return { topics:'topic', members:'member' }[type] || type;
  },

  canMutate(type, row) {
    if (type === 'settings') return false;
    const user = this.currentUser();
    if (!user || user.Status !== '사용') return false;
    if (user.Role === 'admin') return true;
    return type === 'opinion' && String(row.AuthorID) === String(user.ID);
  },

  handleAction(action, id) {
    const [name, type] = String(action || '').split(':');
    if (name === 'detail') this.openDetail(type, id);
    if (name === 'edit') this.openEdit(type, id);
    if (name === 'delete') this.openDelete(type, id);
  },

  openDetail(type, id) {
    const config = this.detailDefinitions()[type];
    if (!config) return;
    const row = this.findRecord(type, id);
    if (!row) {
      ANP.ui.toast('상세 정보를 찾지 못했습니다.', 'warning');
      return;
    }
    const fields = config.fields.map(field => {
      const value = field.formatter ? field.formatter(row) : row[field.key];
      return `<div class="detail-field"><div class="detail-label">${ANP.ui.esc(field.label)}</div><div class="detail-value">${ANP.ui.esc(value || '-')}</div></div>`;
    }).join('');
    const root = ANP.ui.modal({ title:config.title(row), body:`<div class="detail-grid">${fields}</div>`, confirmText:'확인' });
    root.querySelector('[data-dialog="confirm"]').onclick = () => ANP.ui.closeModal();
  },

  findRecord(type, id) {
    const config = this.detailDefinitions()[type];
    if (!config) return null;
    return (config.rows() || []).find(item => String(item.ID || item.Key) === String(id));
  },

  openEdit(type, id) {
    const row = this.findRecord(type, id);
    if (!row) {
      ANP.ui.toast('수정할 항목을 찾지 못했습니다.', 'warning');
      return;
    }
    if (!this.canMutate(type, row)) {
      ANP.ui.toast('수정 권한이 없습니다.', 'warning');
      return;
    }
    const form = this.formDefinitions(row, 'edit')[this.formType(type)];
    if (!form || !form.updateAction) return;
    const root = ANP.ui.modal({ title:form.title, body:`<div class="form-grid">${form.body()}</div>`, confirmText:'수정' });
    const confirm = root.querySelector('[data-dialog="confirm"]');
    confirm.onclick = async () => {
      const data = ANP.ui.collect(form.fields);
      const optional = form.optional || [];
      const missing = form.fields.filter(key => !optional.includes(key) && !data[key]);
      if (missing.length) {
        ANP.ui.toast('필수 항목을 입력하거나 선택하세요.', 'warning');
        return;
      }
      if (data.progress) {
        const progress = Number(data.progress);
        if (Number.isNaN(progress) || progress < 0 || progress > 100) {
          ANP.ui.toast('진행률은 0~100 사이로 입력하세요.', 'warning');
          return;
        }
      }
      data.id = id;
      confirm.disabled = true;
      confirm.textContent = '수정 중';
      try {
        await ANP.api.mutate(form.updateAction, data);
        ANP.ui.closeModal();
        ANP.ui.toast('수정했습니다.', 'success');
        ANP.app.refreshAfterMutation();
      } catch (e) {
        confirm.disabled = false;
        confirm.textContent = '수정';
        ANP.ui.toast(e.message || '수정하지 못했습니다.', 'error');
      }
    };
  },

  openDelete(type, id) {
    const row = this.findRecord(type, id);
    if (!row) {
      ANP.ui.toast('삭제할 항목을 찾지 못했습니다.', 'warning');
      return;
    }
    if (!this.canMutate(type, row)) {
      ANP.ui.toast('삭제 권한이 없습니다.', 'warning');
      return;
    }
    const form = this.formDefinitions(row, 'edit')[this.formType(type)];
    if (!form || !form.deleteAction) return;
    const title = row.Title || row.Name || row.LdapDisplay || row.ID || id;
    const body = `<div class="delete-confirm"><p><b>${ANP.ui.esc(title)}</b> 항목을 삭제합니다.</p><p class="page-desc">삭제 후에는 되돌릴 수 없습니다.</p></div>`;
    const root = ANP.ui.modal({ title:'삭제 확인', body, confirmText:'삭제', danger:true });
    const confirm = root.querySelector('[data-dialog="confirm"]');
    confirm.onclick = async () => {
      confirm.disabled = true;
      confirm.textContent = '삭제 중';
      try {
        await ANP.api.mutate(form.deleteAction, { id });
        ANP.ui.closeModal();
        ANP.ui.toast('삭제했습니다.', 'success');
        ANP.app.refreshAfterMutation();
      } catch (e) {
        confirm.disabled = false;
        confirm.textContent = '삭제';
        ANP.ui.toast(e.message || '삭제하지 못했습니다.', 'error');
      }
    };
  },

  detailDefinitions() {
    const data = ANP.state.data || {};
    return {
      topics: { title:row => row.Title || '연구과제 상세', rows:() => data.topics || [], fields:[{ key:'ID', label:'ID' }, { key:'Title', label:'제목' }, { key:'Description', label:'설명' }, { key:'OwnerName', label:'담당자' }, { key:'Status', label:'상태' }, { key:'CreatedAt', label:'생성일' }, { key:'UpdatedAt', label:'수정일' }] },
      roadmap: { title:row => row.Title || '로드맵 상세', rows:() => data.roadmap || [], fields:[{ key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'Title', label:'로드맵 항목' }, { key:'Status', label:'상태' }, { key:'Progress', label:'진행률' }, { key:'OwnerName', label:'담당자' }, { key:'Note', label:'메모' }, { key:'UpdatedAt', label:'수정일' }] },
      opinion: { title:row => row.Title || '의견 상세', rows:() => data.opinions || [], fields:[{ key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'Title', label:'제목' }, { key:'Opinion', label:'의견' }, { key:'AuthorName', label:'작성자' }, { key:'Status', label:'상태' }, { key:'CreatedAt', label:'작성일' }] },
      decision: { title:row => row.Title || '의사결정 상세', rows:() => data.decisions || [], fields:[{ key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'Title', label:'제목' }, { key:'Decision', label:'결정' }, { key:'Reason', label:'이유' }, { key:'AuthorName', label:'작성자' }, { key:'Status', label:'상태' }, { key:'CreatedAt', label:'작성일' }] },
      framework: { title:row => row.Title || '프레임워크 상세', rows:() => data.frameworks || [], fields:[{ key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'Category', label:'분류' }, { key:'Title', label:'제목' }, { key:'Content', label:'내용' }, { key:'Status', label:'상태' }, { key:'Version', label:'버전' }, { key:'UpdatedAt', label:'수정일' }] },
      settings: { title:row => row.Key || '설정 상세', rows:() => data.settings || [], fields:[{ key:'Key', label:'설정키' }, { key:'Value', label:'값' }, { key:'Description', label:'설명' }, { key:'UpdatedAt', label:'수정일' }, { key:'UpdatedBy', label:'수정자' }] },
      members: { title:row => row.LdapDisplay || row.Name || '사용자 상세', rows:() => data.members || [], fields:[{ key:'ID', label:'ID' }, { key:'LdapID', label:'LdapID' }, { key:'Name', label:'이름' }, { key:'Email', label:'이메일' }, { key:'Department', label:'부서' }, { key:'Team', label:'팀' }, { key:'RoleLabel', label:'역할' }, { key:'Status', label:'상태' }] }
    };
  },

  openForm(type) {
    if (!ANP.ui.requireSession()) return;
    const forms = this.formDefinitions({}, 'add');
    const form = forms[type];
    if (!form) return;

    const root = ANP.ui.modal({ title:form.title, body:`<div class="form-grid">${form.body()}</div>`, confirmText:'저장' });
    const confirm = root.querySelector('[data-dialog="confirm"]');
    confirm.onclick = async () => {
      const data = ANP.ui.collect(form.fields);
      const optional = form.optional || [];
      const missing = form.fields.filter(key => !optional.includes(key) && !data[key]);
      if (missing.length) {
        ANP.ui.toast('필수 항목을 입력하거나 선택하세요.', 'warning');
        return;
      }
      if (data.progress) {
        const progress = Number(data.progress);
        if (Number.isNaN(progress) || progress < 0 || progress > 100) {
          ANP.ui.toast('진행률은 0~100 사이로 입력하세요.', 'warning');
          return;
        }
      }

      confirm.disabled = true;
      confirm.textContent = '저장 중';
      try {
        await ANP.api.mutate(form.action, data);
        ANP.ui.closeModal();
        ANP.ui.toast('저장했습니다.', 'success');
        ANP.app.refreshAfterMutation();
      } catch (e) {
        confirm.disabled = false;
        confirm.textContent = '저장';
        ANP.ui.toast(e.message || '저장하지 못했습니다.', 'error');
      }
    };
  },

  formDefinitions(record = {}, mode = 'add') {
    const value = (key, fallback = '') => record[key] ?? fallback;
    const selectedTopic = value('TopicID', ANP.state.currentTopicId);
    const label = mode === 'edit' ? '수정' : '등록';
    const memberFields = mode === 'edit' ? ['ldapId', 'name', 'email', 'department', 'team', 'role', 'status'] : ['id', 'ldapId', 'name', 'email', 'department', 'team', 'role', 'status'];

    return {
      opinion: {
        title:`의견 ${label}`,
        action:'addOpinion',
        updateAction:'updateOpinion',
        deleteAction:'deleteOpinion',
        fields:['topicId', 'title', 'opinion', 'status'],
        optional:[],
        body:() => `${ANP.ui.formField({ id:'topicId', label:'연구과제', type:'select', required:true, options:ANP.ui.topicOptions(selectedTopic) })}${ANP.ui.formField({ id:'title', label:'제목', required:true, value:value('Title') })}${ANP.ui.formField({ id:'opinion', label:'의견', type:'textarea', required:true, value:value('Opinion') })}${ANP.ui.formField({ id:'status', label:'상태', type:'select', required:true, options:ANP.ui.codeOptions('OPINION_STATUS', value('Status', '열림')) })}`
      },
      decision: {
        title:`의사결정 ${label}`,
        action:'addDecision',
        updateAction:'updateDecision',
        deleteAction:'deleteDecision',
        fields:['topicId', 'title', 'decision', 'reason', 'status'],
        optional:[],
        body:() => `${ANP.ui.formField({ id:'topicId', label:'연구과제', type:'select', required:true, options:ANP.ui.topicOptions(selectedTopic) })}${ANP.ui.formField({ id:'title', label:'제목', required:true, value:value('Title') })}${ANP.ui.formField({ id:'decision', label:'결정', type:'textarea', required:true, value:value('Decision') })}${ANP.ui.formField({ id:'reason', label:'이유', type:'textarea', required:true, value:value('Reason') })}${ANP.ui.formField({ id:'status', label:'상태', type:'select', required:true, options:ANP.ui.codeOptions('DECISION_STATUS', value('Status', '초안')) })}`
      },
      framework: {
        title:`프레임워크 ${mode === 'edit' ? '수정' : '추가'}`,
        action:'addFramework',
        updateAction:'updateFramework',
        deleteAction:'deleteFramework',
        fields:['topicId', 'category', 'title', 'content', 'status'],
        optional:[],
        body:() => `${ANP.ui.formField({ id:'topicId', label:'연구과제', type:'select', required:true, options:ANP.ui.topicOptions(selectedTopic) })}${ANP.ui.formField({ id:'category', label:'분류', required:true, value:value('Category') })}${ANP.ui.formField({ id:'title', label:'제목', required:true, value:value('Title') })}${ANP.ui.formField({ id:'content', label:'내용', type:'textarea', required:true, value:value('Content') })}${ANP.ui.formField({ id:'status', label:'상태', type:'select', required:true, options:ANP.ui.codeOptions('FRAMEWORK_STATUS', value('Status', '초안')) })}`
      },
      roadmap: {
        title:`로드맵 ${mode === 'edit' ? '수정' : '추가'}`,
        action:'addRoadmap',
        updateAction:'updateRoadmap',
        deleteAction:'deleteRoadmap',
        fields:['topicId', 'title', 'status', 'progress', 'ownerId', 'note'],
        optional:['note'],
        body:() => `${ANP.ui.formField({ id:'topicId', label:'연구과제', type:'select', required:true, options:ANP.ui.topicOptions(selectedTopic) })}${ANP.ui.formField({ id:'title', label:'로드맵 항목명', required:true, value:value('Title'), placeholder:'예: 현재 업무 분석, 프로토타입 검증, 운영 전환' })}${ANP.ui.formField({ id:'status', label:'상태', type:'select', required:true, options:ANP.ui.codeOptions('ROADMAP_STATUS', value('Status', '초안')) })}${ANP.ui.formField({ id:'progress', label:'진행률', type:'number', required:true, value:value('Progress', '0') })}${ANP.ui.formField({ id:'ownerId', label:'담당자', type:'select', required:true, options:ANP.ui.memberOptions(value('OwnerID')) })}${ANP.ui.formField({ id:'note', label:'메모', type:'textarea', value:value('Note') })}`
      },
      topic: {
        title:`연구과제 ${mode === 'edit' ? '수정' : '추가'}`,
        action:'addTopic',
        updateAction:'updateTopic',
        deleteAction:'deleteTopic',
        fields:['title', 'description', 'ownerId', 'status'],
        optional:[],
        body:() => `${ANP.ui.formField({ id:'title', label:'제목', required:true, value:value('Title') })}${ANP.ui.formField({ id:'description', label:'설명', type:'textarea', required:true, value:value('Description') })}${ANP.ui.formField({ id:'ownerId', label:'담당자', type:'select', required:true, options:ANP.ui.memberOptions(value('OwnerID')) })}${ANP.ui.formField({ id:'status', label:'상태', type:'select', required:true, options:ANP.ui.codeOptions('TOPIC_STATUS', value('Status', '진행중')) })}`
      },
      member: {
        title:`사용자 ${mode === 'edit' ? '수정' : '추가'}`,
        action:'addMember',
        updateAction:'updateMember',
        deleteAction:'deleteMember',
        fields:memberFields,
        optional:['email', 'department', 'team'],
        body:() => `${mode === 'edit' ? '' : ANP.ui.formField({ id:'id', label:'사번', required:true, value:value('ID') })}${ANP.ui.formField({ id:'ldapId', label:'LdapID', required:true, value:value('LdapID') })}${ANP.ui.formField({ id:'name', label:'이름', required:true, value:value('Name') })}${ANP.ui.formField({ id:'email', label:'이메일', value:value('Email') })}${ANP.ui.formField({ id:'department', label:'부서', value:value('Department') })}${ANP.ui.formField({ id:'team', label:'팀', value:value('Team') })}${ANP.ui.formField({ id:'role', label:'역할', type:'select', required:true, options:ANP.ui.codeOptions('USER_ROLE', value('Role', 'member')) })}${ANP.ui.formField({ id:'status', label:'상태', type:'select', required:true, options:ANP.ui.codeOptions('USER_STATUS', value('Status', '사용')) })}`
      }
    };
  }
};
