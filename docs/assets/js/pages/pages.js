ANP.pages = {
  filtered(name) {
    const rows = ANP.state.data?.[name] || [];
    const topicId = ANP.state.currentTopicId;
    if (!topicId) return rows;
    return rows.filter(r => !r.TopicID || r.TopicID === topicId);
  },

  dashboard() {
    const d = ANP.state.data || {};
    const topics = d.topics || [];
    const roadmap = this.filtered('roadmap');
    const decisions = this.filtered('decisions');
    const opinions = this.filtered('opinions');
    const frameworks = this.filtered('frameworks');
    const done = roadmap.filter(r => r.Status === '완료').length;
    const avg = roadmap.length ? Math.round(roadmap.reduce((a, r) => a + (Number(r.Progress) || 0), 0) / roadmap.length) : 0;
    const current = roadmap.find(r => r.Status === '진행중') || roadmap[0] || {};
    return `
      <div class="section-stack">
        <div class="grid grid-4">
          ${ANP.ui.metric('연구과제', topics.length, '전체 등록 건수')}
          ${ANP.ui.metric('로드맵 진행률', avg + '%', '선택 연구과제 기준')}
          ${ANP.ui.metric('의사결정', decisions.length, '누적 결정')}
          ${ANP.ui.metric('의견', opinions.length, '팀 의견')}
        </div>
        <div class="grid grid-2">
          <div class="card">
            <div class="card-header"><div class="card-title"><h2>현재 진행 위치</h2><p>진행중 상태의 로드맵을 우선 표시합니다.</p></div></div>
            ${current.ID ? `<h3>${ANP.ui.esc(current.Title || current.Phase)}</h3><p class="page-desc">${ANP.ui.esc(current.Description || '')}</p><div style="height:14px"></div>${ANP.ui.badge(current.Status)}<div style="height:14px"></div>${ANP.ui.progress(current.Progress)}` : '<div class="empty">현재 진행 중인 로드맵이 없습니다.</div>'}
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title"><h2>운영 요약</h2><p>오늘 팀원이 확인해야 하는 핵심 정보입니다.</p></div></div>
            <div class="kv"><b>완료 단계</b><span>${done} / ${roadmap.length}</span></div>
            <div class="kv"><b>최근 결정</b><span>${ANP.ui.esc(decisions[0]?.Title || '-')}</span></div>
            <div class="kv"><b>최근 의견</b><span>${ANP.ui.esc(opinions[0]?.Title || opinions[0]?.Topic || '-')}</span></div>
            <div class="kv"><b>프레임워크</b><span>${frameworks.length}건</span></div>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="card"><div class="card-header"><div class="card-title"><h2>최근 의사결정</h2><p>최근 5건</p></div></div>${this.simpleList(decisions, 'Title', 'Decision')}</div>
          <div class="card"><div class="card-header"><div class="card-title"><h2>최근 의견</h2><p>최근 5건</p></div></div>${this.simpleList(opinions, 'Title', 'Opinion')}</div>
        </div>
      </div>`;
  },

  simpleList(rows, titleKey, bodyKey) {
    const list = (rows || []).slice(0,5);
    if (!list.length) return '<div class="empty">등록된 항목이 없습니다.</div>';
    return list.map(r => `<div class="kv"><b>${ANP.ui.esc(r[titleKey] || '-')}</b><span class="preline">${ANP.ui.esc(r[bodyKey] || '')}</span></div>`).join('');
  },

  topics() {
    const rows = ANP.state.data?.topics || [];
    return this.crudPage({
      title: '연구과제', desc: '연구과제를 만들고 상태를 관리합니다.', entity: 'topic', rows,
      columns: [
        { key:'ID', label:'ID' }, { key:'Title', label:'연구과제명' }, { key:'OwnerName', label:'담당자' }, { key:'Status', label:'상태', type:'status' }, { key:'Description', label:'설명', type:'pre' }
      ],
      form: this.topicForm.bind(this), collect: this.collectTopic.bind(this)
    });
  },

  roadmap() {
    const rows = this.filtered('roadmap');
    return this.crudPage({
      title: '로드맵', desc: '연구과제별 단계, 담당자, 진행률을 관리합니다.', entity: 'roadmap', rows,
      columns: [
        { key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'Title', label:'단계' }, { key:'Status', label:'상태', type:'status' }, { key:'Progress', label:'진행률', type:'progress' }, { key:'OwnerName', label:'담당자' }, { key:'Note', label:'비고', type:'pre' }
      ],
      form: this.roadmapForm.bind(this), collect: this.collectRoadmap.bind(this)
    });
  },

  opinion() {
    const rows = this.filtered('opinions');
    return this.crudPage({
      title: '의견', desc: '개인 의견과 팀 논의 내용을 기록합니다.', entity: 'opinion', rows,
      columns: [
        { key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'AuthorName', label:'작성자' }, { key:'Title', label:'제목' }, { key:'Opinion', label:'내용', type:'pre' }, { key:'Status', label:'상태', type:'status' }
      ],
      form: this.opinionForm.bind(this), collect: this.collectOpinion.bind(this)
    });
  },

  decision() {
    const rows = this.filtered('decisions');
    return this.crudPage({
      title: '의사결정', desc: '합의된 결정을 기록하고 이력을 남깁니다.', entity: 'decision', rows,
      columns: [
        { key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'AuthorName', label:'작성자' }, { key:'Title', label:'제목' }, { key:'Decision', label:'결정', type:'pre' }, { key:'Status', label:'상태', type:'status' }
      ],
      form: this.decisionForm.bind(this), collect: this.collectDecision.bind(this)
    });
  },

  framework() {
    const rows = this.filtered('frameworks');
    return this.crudPage({
      title: '프레임워크', desc: '축적된 결정과 원칙을 구조화합니다.', entity: 'framework', rows,
      columns: [
        { key:'ID', label:'ID' }, { key:'TopicTitle', label:'연구과제' }, { key:'Category', label:'분류' }, { key:'Title', label:'제목' }, { key:'Content', label:'내용', type:'pre' }, { key:'Status', label:'상태', type:'status' }, { key:'Version', label:'버전' }
      ],
      form: this.frameworkForm.bind(this), collect: this.collectFramework.bind(this)
    });
  },

  settings() {
    const settings = ANP.state.data?.settings || [];
    const menus = ANP.state.data?.menu || [];
    const codeValues = ANP.state.data?.codes || [];
    return `
      <div class="section-stack">
        ${this.crudPage({ title:'시스템 설정', desc:'시스템명, 설명, 조직명을 관리합니다.', entity:'setting', rows:settings, columns:[{key:'Key', label:'키'}, {key:'Value', label:'값'}, {key:'Description', label:'설명'}], form:this.settingForm.bind(this), collect:this.collectSetting.bind(this), embedded:true })}
        ${this.crudPage({ title:'메뉴 설정', desc:'메뉴명, 표시여부, 순서, 권한을 관리합니다.', entity:'menu', rows:menus, columns:[{key:'ID', label:'메뉴ID'}, {key:'Label', label:'메뉴명'}, {key:'Enabled', label:'표시'}, {key:'Order', label:'순서'}, {key:'Role', label:'권한'}, {key:'Description', label:'설명'}], form:this.menuForm.bind(this), collect:this.collectMenu.bind(this), embedded:true })}
        ${this.crudPage({ title:'코드 설정', desc:'상태, 역할 등 드롭다운 코드를 관리합니다.', entity:'code', rows:codeValues, columns:[{key:'ID', label:'ID'}, {key:'Group', label:'그룹'}, {key:'Label', label:'라벨'}, {key:'Value', label:'값'}, {key:'Order', label:'순서'}, {key:'Enabled', label:'사용'}], form:this.codeForm.bind(this), collect:this.collectCode.bind(this), embedded:true })}
      </div>`;
  },

  members() {
    const rows = ANP.state.data?.members || [];
    return this.crudPage({
      title: '권한관리', desc: '사용자 ID는 기업에서는 사번으로 사용할 수 있습니다.', entity: 'member', rows,
      columns: [
        { key:'ID', label:'사용자ID' }, { key:'Name', label:'이름' }, { key:'Email', label:'이메일' }, { key:'Department', label:'부서' }, { key:'Team', label:'팀' }, { key:'Role', label:'역할' }, { key:'Status', label:'상태', type:'status' }
      ],
      form: this.memberForm.bind(this), collect: this.collectMember.bind(this)
    });
  },

  crudPage({ title, desc, entity, rows, columns, form, collect, embedded = false }) {
    const body = `
      <div class="card">
        <div class="card-header">
          <div class="card-title"><h2>${ANP.ui.esc(title)}</h2><p>${ANP.ui.esc(desc)}</p></div>
          <button class="btn btn-primary" data-create="${entity}">${ANP.ui.esc(title)} 추가</button>
        </div>
        ${ANP.ui.table(rows, columns)}
      </div>`;
    setTimeout(() => this.bindCrud(entity, rows, form, collect), 0);
    return embedded ? body : `<div class="section-stack">${body}</div>`;
  },

  bindCrud(entity, rows, form, collect) {
    document.querySelectorAll(`[data-create="${entity}"]`).forEach(btn => btn.onclick = () => this.openForm(entity, {}, form, collect));
    document.querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => {
      const id = btn.dataset.edit;
      const row = rows.find(r => String(r.ID || r.Key) === String(id));
      if (row) this.openForm(entity, row, form, collect);
    });
    document.querySelectorAll('[data-delete]').forEach(btn => btn.onclick = () => this.remove(entity, btn.dataset.delete));
  },

  async openForm(entity, row, form, collect) {
    const root = await ANP.ui.modal({ title: row.ID || row.Key ? '항목 수정' : '항목 추가', body: form(row), confirmText: '저장' });
    if (!root) return;
    const payload = collect(row);
    const valid = this.validate(payload);
    if (!valid.ok) { ANP.ui.toast(valid.message, 'warning'); return; }
    const ok = await ANP.ui.dialog({ title:'저장 확인', message:'입력한 내용을 저장할까요?', confirmText:'저장' });
    if (!ok) return;
    try {
      if (ANP.state.isSaving) return;
      ANP.state.isSaving = true;
      await ANP.api.mutate('save', { entity, item: payload });
      ANP.ui.toast('저장했습니다.', 'success');
      document.getElementById('dialog-root').innerHTML = '';
      await ANP.app.load();
    } catch (e) {
      ANP.ui.toast(e.message || '저장하지 못했습니다.', 'error');
    } finally {
      ANP.state.isSaving = false;
    }
  },

  async remove(entity, id) {
    const ok = await ANP.ui.dialog({ title:'삭제 확인', message:'삭제한 데이터는 복구하기 어렵습니다. 삭제할까요?', confirmText:'삭제', danger:true });
    if (!ok) return;
    try {
      await ANP.api.mutate('delete', { entity, id });
      ANP.ui.toast('삭제했습니다.', 'success');
      await ANP.app.load();
    } catch (e) { ANP.ui.toast(e.message || '삭제하지 못했습니다.', 'error'); }
  },

  validate(payload) {
    const required = Object.entries(payload).filter(([k]) => k.startsWith('_required_')).map(([,v]) => v);
    for (const key of required) if (!payload[key]) return { ok:false, message:'필수 항목을 입력하거나 선택하세요.' };
    if (payload.Progress !== undefined) {
      const n = Number(payload.Progress);
      if (Number.isNaN(n) || n < 0 || n > 100) return { ok:false, message:'진행률은 0~100 사이로 입력하세요.' };
    }
    Object.keys(payload).filter(k => k.startsWith('_required_')).forEach(k => delete payload[k]);
    return { ok:true };
  },

  topicOptions(selected='') { return ANP.ui.optionList(ANP.state.data?.topics || [], 'ID', 'Title', selected); },
  memberOptions(selected='') { return ANP.ui.optionList(ANP.state.data?.members || [], 'ID', 'Name', selected); },
  statusOptions(group, selected='') {
    const rows = (ANP.state.data?.codes || []).filter(c => c.Group === group && c.Enabled !== 'N');
    return ANP.ui.optionList(rows, 'Value', 'Label', selected);
  },

  topicForm(r={}) { return `<div class="form-grid">${ANP.ui.formField({id:'ID', label:'ID', value:r.ID || '', placeholder:'자동 생성 또는 직접 입력'})}${ANP.ui.formField({id:'Title', label:'연구과제명', value:r.Title, required:true})}${ANP.ui.formField({id:'OwnerID', label:'담당자', type:'select', options:this.memberOptions(r.OwnerID), required:true})}${ANP.ui.formField({id:'Status', label:'상태', type:'select', options:this.statusOptions('TOPIC_STATUS', r.Status), required:true})}${ANP.ui.formField({id:'Description', label:'설명', type:'textarea', value:r.Description})}<input type="hidden" id="_required_1" value="Title"><input type="hidden" id="_required_2" value="OwnerID"><input type="hidden" id="_required_3" value="Status"></div>`; },
  collectTopic(r={}) { return {...ANP.ui.collect(['ID','Title','OwnerID','Status','Description','_required_1','_required_2','_required_3'])}; },

  roadmapForm(r={}) { return `<div class="form-grid form-2">${ANP.ui.formField({id:'ID', label:'ID', value:r.ID || ''})}${ANP.ui.formField({id:'TopicID', label:'연구과제', type:'select', options:this.topicOptions(r.TopicID), required:true})}${ANP.ui.formField({id:'Title', label:'단계명', value:r.Title, required:true})}${ANP.ui.formField({id:'Status', label:'상태', type:'select', options:this.statusOptions('ROADMAP_STATUS', r.Status), required:true})}${ANP.ui.formField({id:'Progress', label:'진행률', type:'number', value:r.Progress || 0, required:true})}${ANP.ui.formField({id:'OwnerID', label:'담당자', type:'select', options:this.memberOptions(r.OwnerID), required:true})}<div style="grid-column:1/-1">${ANP.ui.formField({id:'Note', label:'비고', type:'textarea', value:r.Note})}</div><input type="hidden" id="_required_1" value="TopicID"><input type="hidden" id="_required_2" value="Title"><input type="hidden" id="_required_3" value="Status"><input type="hidden" id="_required_4" value="OwnerID"></div>`; },
  collectRoadmap() { return {...ANP.ui.collect(['ID','TopicID','Title','Status','Progress','OwnerID','Note','_required_1','_required_2','_required_3','_required_4'])}; },

  opinionForm(r={}) { return `<div class="form-grid">${ANP.ui.formField({id:'ID', label:'ID', value:r.ID || ''})}${ANP.ui.formField({id:'TopicID', label:'연구과제', type:'select', options:this.topicOptions(r.TopicID), required:true})}${ANP.ui.formField({id:'AuthorID', label:'작성자', type:'select', options:this.memberOptions(r.AuthorID || ANP.state.session.userId), required:true})}${ANP.ui.formField({id:'Title', label:'제목', value:r.Title, required:true})}${ANP.ui.formField({id:'Opinion', label:'의견', type:'textarea', value:r.Opinion, required:true})}${ANP.ui.formField({id:'Status', label:'상태', type:'select', options:this.statusOptions('OPINION_STATUS', r.Status), required:true})}<input type="hidden" id="_required_1" value="TopicID"><input type="hidden" id="_required_2" value="AuthorID"><input type="hidden" id="_required_3" value="Title"><input type="hidden" id="_required_4" value="Opinion"><input type="hidden" id="_required_5" value="Status"></div>`; },
  collectOpinion() { return {...ANP.ui.collect(['ID','TopicID','AuthorID','Title','Opinion','Status','_required_1','_required_2','_required_3','_required_4','_required_5'])}; },

  decisionForm(r={}) { return `<div class="form-grid">${ANP.ui.formField({id:'ID', label:'ID', value:r.ID || ''})}${ANP.ui.formField({id:'TopicID', label:'연구과제', type:'select', options:this.topicOptions(r.TopicID), required:true})}${ANP.ui.formField({id:'AuthorID', label:'작성자', type:'select', options:this.memberOptions(r.AuthorID || ANP.state.session.userId), required:true})}${ANP.ui.formField({id:'Title', label:'제목', value:r.Title, required:true})}${ANP.ui.formField({id:'Decision', label:'결정', type:'textarea', value:r.Decision, required:true})}${ANP.ui.formField({id:'Reason', label:'이유', type:'textarea', value:r.Reason})}${ANP.ui.formField({id:'Status', label:'상태', type:'select', options:this.statusOptions('DECISION_STATUS', r.Status), required:true})}<input type="hidden" id="_required_1" value="TopicID"><input type="hidden" id="_required_2" value="AuthorID"><input type="hidden" id="_required_3" value="Title"><input type="hidden" id="_required_4" value="Decision"><input type="hidden" id="_required_5" value="Status"></div>`; },
  collectDecision() { return {...ANP.ui.collect(['ID','TopicID','AuthorID','Title','Decision','Reason','Status','_required_1','_required_2','_required_3','_required_4','_required_5'])}; },

  frameworkForm(r={}) { return `<div class="form-grid">${ANP.ui.formField({id:'ID', label:'ID', value:r.ID || ''})}${ANP.ui.formField({id:'TopicID', label:'연구과제', type:'select', options:this.topicOptions(r.TopicID), required:true})}${ANP.ui.formField({id:'Category', label:'분류', value:r.Category, required:true})}${ANP.ui.formField({id:'Title', label:'제목', value:r.Title, required:true})}${ANP.ui.formField({id:'Content', label:'내용', type:'textarea', value:r.Content, required:true})}${ANP.ui.formField({id:'Status', label:'상태', type:'select', options:this.statusOptions('FRAMEWORK_STATUS', r.Status), required:true})}${ANP.ui.formField({id:'Version', label:'버전', value:r.Version || '0.1'})}<input type="hidden" id="_required_1" value="TopicID"><input type="hidden" id="_required_2" value="Category"><input type="hidden" id="_required_3" value="Title"><input type="hidden" id="_required_4" value="Content"><input type="hidden" id="_required_5" value="Status"></div>`; },
  collectFramework() { return {...ANP.ui.collect(['ID','TopicID','Category','Title','Content','Status','Version','_required_1','_required_2','_required_3','_required_4','_required_5'])}; },

  settingForm(r={}) { return `<div class="form-grid">${ANP.ui.formField({id:'Key', label:'키', value:r.Key, required:true})}${ANP.ui.formField({id:'Value', label:'값', value:r.Value})}${ANP.ui.formField({id:'Description', label:'설명', value:r.Description})}<input type="hidden" id="_required_1" value="Key"></div>`; },
  collectSetting(){ return {...ANP.ui.collect(['Key','Value','Description','_required_1'])}; },
  menuForm(r={}) { return `<div class="form-grid form-2">${ANP.ui.formField({id:'ID', label:'메뉴ID', value:r.ID, required:true})}${ANP.ui.formField({id:'Label', label:'메뉴명', value:r.Label, required:true})}${ANP.ui.formField({id:'Enabled', label:'표시여부', type:'select', options:`<option value="">선택하세요.</option><option ${r.Enabled==='Y'?'selected':''}>Y</option><option ${r.Enabled==='N'?'selected':''}>N</option>`, required:true})}${ANP.ui.formField({id:'Order', label:'순서', type:'number', value:r.Order || 1})}${ANP.ui.formField({id:'Role', label:'권한', value:r.Role || 'viewer'})}${ANP.ui.formField({id:'Description', label:'설명', value:r.Description})}<input type="hidden" id="_required_1" value="ID"><input type="hidden" id="_required_2" value="Label"><input type="hidden" id="_required_3" value="Enabled"></div>`; },
  collectMenu(){ return {...ANP.ui.collect(['ID','Label','Enabled','Order','Role','Description','_required_1','_required_2','_required_3'])}; },
  codeForm(r={}) { return `<div class="form-grid form-2">${ANP.ui.formField({id:'ID', label:'ID', value:r.ID})}${ANP.ui.formField({id:'Group', label:'그룹', value:r.Group, required:true})}${ANP.ui.formField({id:'Label', label:'라벨', value:r.Label, required:true})}${ANP.ui.formField({id:'Value', label:'값', value:r.Value, required:true})}${ANP.ui.formField({id:'Order', label:'순서', type:'number', value:r.Order || 1})}${ANP.ui.formField({id:'Enabled', label:'사용', type:'select', options:`<option value="">선택하세요.</option><option ${r.Enabled==='Y'?'selected':''}>Y</option><option ${r.Enabled==='N'?'selected':''}>N</option>`})}<input type="hidden" id="_required_1" value="Group"><input type="hidden" id="_required_2" value="Label"><input type="hidden" id="_required_3" value="Value"></div>`; },
  collectCode(){ return {...ANP.ui.collect(['ID','Group','Label','Value','Order','Enabled','_required_1','_required_2','_required_3'])}; },
  memberForm(r={}) { return `<div class="form-grid form-2">${ANP.ui.formField({id:'ID', label:'사용자ID/사번', value:r.ID, required:true})}${ANP.ui.formField({id:'Name', label:'이름', value:r.Name, required:true})}${ANP.ui.formField({id:'Email', label:'이메일', value:r.Email})}${ANP.ui.formField({id:'Department', label:'부서', value:r.Department})}${ANP.ui.formField({id:'Team', label:'팀', value:r.Team})}${ANP.ui.formField({id:'Role', label:'역할', type:'select', options:this.statusOptions('USER_ROLE', r.Role), required:true})}${ANP.ui.formField({id:'Status', label:'상태', type:'select', options:this.statusOptions('USER_STATUS', r.Status), required:true})}<input type="hidden" id="_required_1" value="ID"><input type="hidden" id="_required_2" value="Name"><input type="hidden" id="_required_3" value="Role"><input type="hidden" id="_required_4" value="Status"></div>`; },
  collectMember(){ return {...ANP.ui.collect(['ID','Name','Email','Department','Team','Role','Status','_required_1','_required_2','_required_3','_required_4'])}; }
};
