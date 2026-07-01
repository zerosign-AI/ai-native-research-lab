window.ANP = window.ANP || {};
ANP.state = {
  data: {},
  currentPage: 'dashboard',
  currentTopicId: '',
  session: {
    userId: localStorage.getItem('anp_user_id') || '',
    writeKey: localStorage.getItem('anp_write_key') || ''
  },
  filters: {}
};
ANP.constants = {
  pageMeta: {
    dashboard: ['대시보드', '현재 연구 진행 상황을 확인합니다.'],
    topics: ['연구과제', '여러 연구과제를 관리합니다.'],
    roadmap: ['로드맵', '연구과제별 진행 단계를 관리합니다.'],
    opinion: ['의견', '팀원 의견을 기록하고 검토합니다.'],
    decision: ['의사결정', '작은 의사결정을 축적합니다.'],
    framework: ['프레임워크', '합의된 연구 구조를 관리합니다.'],
    settings: ['설정', '시스템명, 메뉴, 코드값을 관리합니다.'],
    members: ['권한관리', '사용자와 역할을 관리합니다.']
  }
};
