ANP.pages = {
  scoped(rows) { const id = ANP.state.currentTopicId; return id ? (rows || []).filter(r => r.TopicID === id || r.ID === id) : (rows || []); },
  dashboard() {
    const d = ANP.state.data || {};
    const decisions = this.scoped(d.decisions || []);
    const opinions = this.scoped(d.opinions || []);
    const roadmap = this.scoped(d.roadmap || []);
    const done = roadmap.filter(r => r.Status === '완료').length;
    const avg = roadmap.length ? Math.round(roadmap.reduce((s,r)=>s+(Number(r.Progress)||0),0)/roadmap.length) : 0;
    return `<div class="section-stack">
      <div class="grid cols-4">
        ${ANP.ui.metric('연구과제', (d.topics || []).length, '등록된 전체 연구과제')}
        ${ANP.ui.metric('로드맵 진행률', avg + '%', `${done}/${roadmap.length} 완료`)}
        ${ANP.ui.metric('의사결정', decisions.length, '선택 범위 기준')}
        ${ANP.ui.metric('의견', opinions.length, '선택 범위 기준')}
      </div>
      <div class="grid cols-2">
        <div class="card"><div class="card-head"><h2>최근 의사결정</h2></div>${this.recent(decisions, 'Title', 'Decision')}</div>
        <div class="card"><div class="card-head"><h2>최근 의견</h2></div>${this.recent(opinions, 'Title', 'Opinion')}</div>
      </div>
    </div>`;
  },
  recent(rows, title, body) {
    if (!rows.length) return `<div class="empty">등록된 항목이 없습니다.</div>`;
    return rows.slice(0,5).map(r => `<div class="list-card"><div class="td-title">${ANP.ui.esc(r[title])}</div><div class="page-desc td-pre">${ANP.ui.esc(r[body])}</div><div>${ANP.ui.badge(r.Status)}</div></div>`).join('');
  },
  topics() {
    const rows = ANP.ui.applyFilter(ANP.state.data?.topics || [], 'topics', ['Title','Description','Status','OwnerName']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>연구과제 목록</h2><p class="page-desc">여러 연구과제를 관리합니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('topics')}<button class="btn btn-primary" data-add="topic">연구과제 추가</button></div></div>${ANP.ui.table(rows,[{key:'Title',label:'제목',type:'title',width:'24%'},{key:'Description',label:'설명',type:'pre',width:'36%'},{key:'OwnerName',label:'담당자',width:'16%'},{key:'Status',label:'상태',type:'status',width:'12%'},{key:'UpdatedAt',label:'수정일',width:'12%'}])}</div></div>`;
  },
  roadmap() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.roadmap || []), 'roadmap', ['Title','TopicTitle','OwnerName','Status','Note']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>로드맵</h2><p class="page-desc">진행 단계와 담당자를 관리합니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('roadmap')}<button class="btn btn-primary" data-add="roadmap">로드맵 추가</button></div></div>${ANP.ui.table(rows,[{key:'TopicTitle',label:'연구과제',type:'title',width:'22%'},{key:'Title',label:'단계',type:'title',width:'22%'},{key:'Status',label:'상태',type:'status',width:'10%'},{key:'Progress',label:'진행률',type:'progress',width:'12%'},{key:'OwnerName',label:'담당자',width:'12%'},{key:'Note',label:'메모',type:'pre',width:'22%'}])}</div></div>`;
  },
  opinion() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.opinions || []), 'opinion', ['Title','Opinion','AuthorName','TopicTitle','Status']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>의견</h2><p class="page-desc">팀원 의견을 기록합니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('opinion')}<button class="btn btn-primary" data-add="opinion">의견 등록</button></div></div>${ANP.ui.table(rows,[{key:'TopicTitle',label:'연구과제',type:'title',width:'20%'},{key:'Title',label:'제목',type:'title',width:'20%'},{key:'Opinion',label:'의견',type:'pre',width:'32%'},{key:'AuthorName',label:'작성자',width:'12%'},{key:'Status',label:'상태',type:'status',width:'8%'},{key:'CreatedAt',label:'작성일',width:'8%'}])}</div></div>`;
  },
  decision() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.decisions || []), 'decision', ['Title','Decision','Reason','AuthorName','TopicTitle','Status']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>의사결정</h2><p class="page-desc">작은 의사결정을 축적합니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('decision')}<button class="btn btn-primary" data-add="decision">의사결정 등록</button></div></div>${ANP.ui.table(rows,[{key:'TopicTitle',label:'연구과제',type:'title',width:'18%'},{key:'Title',label:'제목',type:'title',width:'18%'},{key:'Decision',label:'결정',type:'pre',width:'26%'},{key:'Reason',label:'이유',type:'pre',width:'22%'},{key:'AuthorName',label:'작성자',width:'8%'},{key:'Status',label:'상태',type:'status',width:'8%'}])}</div></div>`;
  },
  framework() {
    const rows = ANP.ui.applyFilter(this.scoped(ANP.state.data?.frameworks || []), 'framework', ['Category','Title','Content','TopicTitle','Status']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>프레임워크</h2><p class="page-desc">합의된 구조를 관리합니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('framework')}<button class="btn btn-primary" data-add="framework">프레임워크 추가</button></div></div>${ANP.ui.table(rows,[{key:'TopicTitle',label:'연구과제',type:'title',width:'18%'},{key:'Category',label:'분류',width:'12%'},{key:'Title',label:'제목',type:'title',width:'20%'},{key:'Content',label:'내용',type:'pre',width:'34%'},{key:'Status',label:'상태',type:'status',width:'8%'},{key:'Version',label:'버전',width:'8%'}])}</div></div>`;
  },
  settings() {
    const rows = ANP.ui.applyFilter(ANP.state.data?.settings || [], 'settings', ['Key','Value','Description']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>설정</h2><p class="page-desc">시스템 설정을 관리합니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('settings')}</div></div>${ANP.ui.table(rows,[{key:'Key',label:'설정키',type:'title',width:'20%'},{key:'Value',label:'값',type:'title',width:'28%'},{key:'Description',label:'설명',type:'pre',width:'34%'},{key:'UpdatedAt',label:'수정일',width:'18%'}])}</div></div>`;
  },
  members() {
    const rows = ANP.ui.applyFilter(ANP.state.data?.members || [], 'members', ['LdapID','Name','Email','Role','Status']);
    return `<div class="section-stack"><div class="card"><div class="toolbar"><div><h2>권한관리</h2><p class="page-desc">사용자와 역할을 관리합니다. 사번(ID)은 내부키로 사용하며 목록에는 노출하지 않습니다.</p></div><div class="toolbar-right">${ANP.ui.filterBox('members')}<button class="btn btn-primary" data-add="member">사용자 추가</button></div></div>${ANP.ui.table(rows,[{key:'LdapDisplay',label:'LdapID (이름)',type:'title',width:'22%'},{key:'Email',label:'이메일',width:'24%'},{key:'Department',label:'부서',width:'14%'},{key:'Team',label:'팀',width:'14%'},{key:'RoleLabel',label:'역할',width:'12%'},{key:'Status',label:'상태',type:'status',width:'14%'}])}</div></div>`;
  },
  bind() {
    document.querySelectorAll('[data-add]').forEach(btn => btn.onclick = () => this.openForm(btn.dataset.add));
  },
  openForm(type) {
    if (!ANP.ui.requireSession()) return;
    const forms = {
      opinion: { title:'의견 등록', action:'addOpinion', fields:['topicId','title','opinion','status'], body:()=>`${ANP.ui.formField({id:'topicId',label:'연구과제',type:'select',required:true,options:ANP.ui.topicOptions(ANP.state.currentTopicId)})}${ANP.ui.formField({id:'title',label:'제목',required:true})}${ANP.ui.formField({id:'opinion',label:'의견',type:'textarea',required:true})}${ANP.ui.formField({id:'status',label:'상태',type:'select',required:true,options:ANP.ui.codeOptions('OPINION_STATUS','열림')})}`},
      decision: { title:'의사결정 등록', action:'addDecision', fields:['topicId','title','decision','reason','status'], body:()=>`${ANP.ui.formField({id:'topicId',label:'연구과제',type:'select',required:true,options:ANP.ui.topicOptions(ANP.state.currentTopicId)})}${ANP.ui.formField({id:'title',label:'제목',required:true})}${ANP.ui.formField({id:'decision',label:'결정',type:'textarea',required:true})}${ANP.ui.formField({id:'reason',label:'이유',type:'textarea',required:true})}${ANP.ui.formField({id:'status',label:'상태',type:'select',required:true,options:ANP.ui.codeOptions('DECISION_STATUS','초안')})}`},
      framework: { title:'프레임워크 추가', action:'addFramework', fields:['topicId','category','title','content','status'], body:()=>`${ANP.ui.formField({id:'topicId',label:'연구과제',type:'select',required:true,options:ANP.ui.topicOptions(ANP.state.currentTopicId)})}${ANP.ui.formField({id:'category',label:'분류',required:true})}${ANP.ui.formField({id:'title',label:'제목',required:true})}${ANP.ui.formField({id:'content',label:'내용',type:'textarea',required:true})}${ANP.ui.formField({id:'status',label:'상태',type:'select',required:true,options:ANP.ui.codeOptions('FRAMEWORK_STATUS','초안')})}`},
      roadmap: { title:'로드맵 추가', action:'addRoadmap', fields:['topicId','title','status','progress','ownerId','note'], body:()=>`${ANP.ui.formField({id:'topicId',label:'연구과제',type:'select',required:true,options:ANP.ui.topicOptions(ANP.state.currentTopicId)})}${ANP.ui.formField({id:'title',label:'단계명',required:true})}${ANP.ui.formField({id:'status',label:'상태',type:'select',required:true,options:ANP.ui.codeOptions('ROADMAP_STATUS','초안')})}${ANP.ui.formField({id:'progress',label:'진행률',type:'number',required:true,value:'0'})}${ANP.ui.formField({id:'ownerId',label:'담당자',type:'select',required:true,options:ANP.ui.memberOptions()})}${ANP.ui.formField({id:'note',label:'메모',type:'textarea'})}`},
      topic: { title:'연구과제 추가', action:'addTopic', fields:['title','description','ownerId','status'], body:()=>`${ANP.ui.formField({id:'title',label:'제목',required:true})}${ANP.ui.formField({id:'description',label:'설명',type:'textarea',required:true})}${ANP.ui.formField({id:'ownerId',label:'담당자',type:'select',required:true,options:ANP.ui.memberOptions()})}${ANP.ui.formField({id:'status',label:'상태',type:'select',required:true,options:ANP.ui.codeOptions('TOPIC_STATUS','진행중')})}`},
      member: { title:'사용자 추가', action:'addMember', fields:['id','ldapId','name','email','department','team','role','status'], body:()=>`${ANP.ui.formField({id:'id',label:'사번',required:true})}${ANP.ui.formField({id:'ldapId',label:'LdapID',required:true})}${ANP.ui.formField({id:'name',label:'이름',required:true})}${ANP.ui.formField({id:'email',label:'이메일'})}${ANP.ui.formField({id:'department',label:'부서'})}${ANP.ui.formField({id:'team',label:'팀'})}${ANP.ui.formField({id:'role',label:'역할',type:'select',required:true,options:ANP.ui.codeOptions('USER_ROLE','member')})}${ANP.ui.formField({id:'status',label:'상태',type:'select',required:true,options:ANP.ui.codeOptions('USER_STATUS','사용')})}`}
    };
    const f = forms[type]; if (!f) return;
    const root = ANP.ui.modal({ title:f.title, body:`<div class="form-grid">${f.body()}</div>`, confirmText:'저장' });
    root.querySelector('[data-dialog="confirm"]').onclick = async () => {
      const data = ANP.ui.collect(f.fields);
      const miss = f.fields.filter(k => ['note','email','department','team'].indexOf(k) < 0 && !data[k]);
      if (miss.length) { ANP.ui.toast('필수 항목을 입력하거나 선택하세요.', 'warning'); return; }
      if (data.progress && (Number(data.progress) < 0 || Number(data.progress) > 100)) { ANP.ui.toast('진행률은 0~100 사이로 입력하세요.', 'warning'); return; }
      try { await ANP.api.mutate(f.action, data); ANP.ui.closeModal(); ANP.ui.toast('저장했습니다.', 'success'); await ANP.app.load(); }
      catch(e){ ANP.ui.toast(e.message || '저장하지 못했습니다.', 'error'); }
    };
  }
};
