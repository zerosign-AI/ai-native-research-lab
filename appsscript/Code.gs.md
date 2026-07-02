const SHEETS = {
  SETTINGS: '00_Settings',
  MENU: '01_Menu',
  MEMBERS: '02_Members',
  TOPICS: '03_Research_Topic',
  ROADMAP: '04_Roadmap',
  DECISIONS: '05_Decision',
  OPINIONS: '06_Opinion',
  FRAMEWORKS: '07_Framework',
  CODES: '08_Code',
  AUDIT: '09_Audit_Log'
};

const ACTIONS = {
  addOpinion: (data, userId) => addOpinion_(data, userId),
  addDecision: (data, userId) => addDecision_(data, userId),
  addFramework: (data, userId) => addFramework_(data, userId),
  addRoadmap: (data, userId) => addRoadmap_(data, userId),
  addTopic: (data, userId) => addTopic_(data, userId),
  addMember: (data, userId) => addMember_(data, userId),
  updateOpinion: (data, userId) => updateOpinion_(data, userId),
  deleteOpinion: (data, userId) => deleteOpinion_(data, userId),
  updateDecision: (data, userId) => updateDecision_(data, userId),
  deleteDecision: (data, userId) => deleteDecision_(data, userId),
  updateFramework: (data, userId) => updateFramework_(data, userId),
  deleteFramework: (data, userId) => deleteFramework_(data, userId),
  updateRoadmap: (data, userId) => updateRoadmap_(data, userId),
  deleteRoadmap: (data, userId) => deleteRoadmap_(data, userId),
  updateTopic: (data, userId) => updateTopic_(data, userId),
  deleteTopic: (data, userId) => deleteTopic_(data, userId),
  updateMember: (data, userId) => updateMember_(data, userId),
  deleteMember: (data, userId) => deleteMember_(data, userId)
};

function doGet(e) {
  return json_({ ok: true, data: getBoardData_() });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const data = payload.data || {};
    const userId = String(payload.userId || '');
    const action = payload.action;

    if (!checkWriteKey_(payload.writeKey)) return json_({ ok: false, message: '팀 암호가 올바르지 않습니다.' });
    if (!userId) return json_({ ok: false, message: '작성자 정보가 없습니다.' });
    if (!ACTIONS[action]) return json_({ ok: false, message: '지원하지 않는 요청입니다.' });

    getActiveUser_(userId);
    const result = ACTIONS[action](data, userId);
    log_(action, userId, JSON.stringify(data));
    return json_({ ok: true, data: result });
  } catch (err) {
    return json_({ ok: false, message: err.message || String(err) });
  }
}

function setupSheets() {
  const ss = SpreadsheetApp.getActive();
  create_(ss, SHEETS.SETTINGS, ['Key', 'Value', 'Description', 'UpdatedAt', 'UpdatedBy'], [
    ['SystemName', 'AI Native Platform', '화면에 표시되는 시스템명', now_(), 'system'],
    ['AppName', 'Research Lab', '첫 번째 앱 이름', now_(), 'system'],
    ['OrganizationName', '조직명을 입력하세요', '사용 조직명', now_(), 'system'],
    ['TeamName', '팀명을 입력하세요', '사용 팀명', now_(), 'system'],
    ['Version', 'v1.0.0-rc3', '제품 버전', now_(), 'system'],
    ['WriteKey', 'axplanning', '입력 권한 검증용 팀 암호', now_(), 'system'],
    ['UserKeyLabel', '사번', '사용자 식별키 화면 표시명', now_(), 'system']
  ]);
  create_(ss, SHEETS.MENU, ['ID', 'Label', 'Enabled', 'Order', 'Role', 'Description', 'UpdatedAt', 'UpdatedBy'], [
    ['dashboard', '대시보드', 'Y', 1, 'viewer', '전체 현황', now_(), 'system'],
    ['topics', '연구과제', 'Y', 2, 'member', '연구과제 관리', now_(), 'system'],
    ['roadmap', '로드맵', 'Y', 3, 'member', '진행 단계 관리', now_(), 'system'],
    ['opinion', '의견', 'Y', 4, 'member', '팀 의견 관리', now_(), 'system'],
    ['decision', '의사결정', 'Y', 5, 'member', '결정 기록 관리', now_(), 'system'],
    ['framework', '프레임워크', 'Y', 6, 'member', '구조화된 연구 결과 관리', now_(), 'system'],
    ['settings', '설정', 'Y', 90, 'admin', '시스템 설정', now_(), 'system'],
    ['members', '권한관리', 'Y', 99, 'admin', '사용자/권한 관리', now_(), 'system']
  ]);
  create_(ss, SHEETS.MEMBERS, ['ID', 'LdapID', 'Name', 'Email', 'Department', 'Team', 'Role', 'Status', 'CreatedAt', 'UpdatedAt', 'UpdatedBy'], [
    ['admin', 'admin', '관리자', 'admin@example.com', '', '', 'admin', '사용', now_(), now_(), 'system'],
    ['member', 'member', '팀원', 'member@example.com', '', '', 'member', '사용', now_(), now_(), 'system']
  ]);
  create_(ss, SHEETS.TOPICS, ['ID', 'Title', 'Description', 'OwnerID', 'Status', 'CreatedAt', 'UpdatedAt', 'UpdatedBy'], [
    ['TOPIC-0001', 'AX기획팀 AI Native 전환', 'AX기획팀의 업무영역별 AI Native 전환 방법을 연구한다.', 'admin', '진행중', now_(), now_(), 'system'],
    ['TOPIC-0002', 'AI Native 평가전략', 'AI Native 업무와 조직의 평가 기준을 연구한다.', 'admin', '진행중', now_(), now_(), 'system']
  ]);
  create_(ss, SHEETS.ROADMAP, ['ID', 'TopicID', 'Title', 'Status', 'Progress', 'OwnerID', 'Note', 'CreatedAt', 'UpdatedAt', 'UpdatedBy'], [
    ['ROAD-0001', 'TOPIC-0001', '현재 업무 분석', '진행중', 30, 'admin', '업무영역 목록 정리', now_(), now_(), 'system'],
    ['ROAD-0002', 'TOPIC-0001', 'AI 도입 방식 분석', '초안', 0, 'admin', '지침/하네스/AI 구성원 구분', now_(), now_(), 'system']
  ]);
  create_(ss, SHEETS.DECISIONS, ['ID', 'TopicID', 'AuthorID', 'Title', 'Decision', 'Reason', 'Status', 'CreatedAt', 'UpdatedAt', 'UpdatedBy'], [
    ['DEC-0001', 'TOPIC-0001', 'admin', '문서 언어 원칙', '문서는 한글을 기본으로 작성하고 필요한 전문용어는 영어를 유지한다.', '한글 사용자 중심의 협업을 위해서다.', '승인', now_(), now_(), 'system']
  ]);
  create_(ss, SHEETS.OPINIONS, ['ID', 'TopicID', 'AuthorID', 'Title', 'Opinion', 'Status', 'CreatedAt', 'UpdatedAt', 'UpdatedBy'], [
    ['OPN-0001', 'TOPIC-0001', 'admin', '업무영역별 AI 도입 방식', '업무영역별로 지침, 하네스, AI 구성원, 지식, 평가 기준을 분석한다.', '열림', now_(), now_(), 'system']
  ]);
  create_(ss, SHEETS.FRAMEWORKS, ['ID', 'TopicID', 'Category', 'Title', 'Content', 'Status', 'Version', 'CreatedAt', 'UpdatedAt', 'UpdatedBy'], [
    ['FW-0001', 'TOPIC-0001', '정의', 'AI Native', 'AI를 기존 업무에 추가하는 것이 아니라, AI와 사람이 함께 일하는 것을 전제로 업무·조직·운영 방식을 재설계하는 접근이다.', '초안', '0.1', now_(), now_(), 'system']
  ]);
  create_(ss, SHEETS.CODES, ['ID', 'Group', 'Label', 'Value', 'Order', 'Enabled', 'UpdatedAt', 'UpdatedBy'], [
    ['CODE-0001', 'TOPIC_STATUS', '진행중', '진행중', 1, 'Y', now_(), 'system'],
    ['CODE-0002', 'TOPIC_STATUS', '보류', '보류', 2, 'Y', now_(), 'system'],
    ['CODE-0003', 'TOPIC_STATUS', '완료', '완료', 3, 'Y', now_(), 'system'],
    ['CODE-0004', 'ROADMAP_STATUS', '초안', '초안', 1, 'Y', now_(), 'system'],
    ['CODE-0005', 'ROADMAP_STATUS', '진행중', '진행중', 2, 'Y', now_(), 'system'],
    ['CODE-0006', 'ROADMAP_STATUS', '검토', '검토', 3, 'Y', now_(), 'system'],
    ['CODE-0007', 'ROADMAP_STATUS', '완료', '완료', 4, 'Y', now_(), 'system'],
    ['CODE-0008', 'OPINION_STATUS', '열림', '열림', 1, 'Y', now_(), 'system'],
    ['CODE-0009', 'OPINION_STATUS', '검토', '검토', 2, 'Y', now_(), 'system'],
    ['CODE-0010', 'OPINION_STATUS', '종료', '종료', 3, 'Y', now_(), 'system'],
    ['CODE-0011', 'DECISION_STATUS', '초안', '초안', 1, 'Y', now_(), 'system'],
    ['CODE-0012', 'DECISION_STATUS', '승인', '승인', 2, 'Y', now_(), 'system'],
    ['CODE-0013', 'DECISION_STATUS', '반려', '반려', 3, 'Y', now_(), 'system'],
    ['CODE-0014', 'FRAMEWORK_STATUS', '초안', '초안', 1, 'Y', now_(), 'system'],
    ['CODE-0015', 'FRAMEWORK_STATUS', '검토', '검토', 2, 'Y', now_(), 'system'],
    ['CODE-0016', 'FRAMEWORK_STATUS', '승인', '승인', 3, 'Y', now_(), 'system'],
    ['CODE-0017', 'USER_ROLE', '관리자', 'admin', 1, 'Y', now_(), 'system'],
    ['CODE-0018', 'USER_ROLE', '멤버', 'member', 2, 'Y', now_(), 'system'],
    ['CODE-0019', 'USER_ROLE', '뷰어', 'viewer', 3, 'Y', now_(), 'system'],
    ['CODE-0020', 'USER_STATUS', '사용', '사용', 1, 'Y', now_(), 'system'],
    ['CODE-0021', 'USER_STATUS', '미사용', '미사용', 2, 'Y', now_(), 'system']
  ]);
  create_(ss, SHEETS.AUDIT, ['ID', 'Action', 'UserID', 'Payload', 'CreatedAt'], []);
  return { ok: true };
}

function getBoardData_() {
  const data = {
    settings: rows_(SHEETS.SETTINGS),
    menu: rows_(SHEETS.MENU),
    members: rows_(SHEETS.MEMBERS),
    topics: rows_(SHEETS.TOPICS),
    roadmap: rows_(SHEETS.ROADMAP),
    decisions: rows_(SHEETS.DECISIONS).reverse(),
    opinions: rows_(SHEETS.OPINIONS).reverse(),
    frameworks: rows_(SHEETS.FRAMEWORKS),
    codes: rows_(SHEETS.CODES).sort((a, b) => Number(a.Order || 0) - Number(b.Order || 0))
  };
  enrich_(data);
  return data;
}

function enrich_(data) {
  const members = Object.fromEntries((data.members || []).map(member => [member.ID, member]));
  const topics = Object.fromEntries((data.topics || []).map(topic => [topic.ID, topic]));
  const role = Object.fromEntries((data.codes || []).filter(code => code.Group === 'USER_ROLE').map(code => [code.Value, code.Label]));
  (data.members || []).forEach(member => {
    member.RoleLabel = role[member.Role] || member.Role;
    member.LdapDisplay = (member.LdapID || member.ID) + ' (' + (member.Name || '-') + ')';
  });
  ['topics', 'roadmap', 'decisions', 'opinions', 'frameworks'].forEach(key => (data[key] || []).forEach(row => {
    if (row.OwnerID) row.OwnerName = members[row.OwnerID]?.Name || row.OwnerID;
    if (row.AuthorID) row.AuthorName = members[row.AuthorID]?.Name || row.AuthorID;
    if (row.TopicID) row.TopicTitle = topics[row.TopicID]?.Title || row.TopicID;
  }));
}

function addOpinion_(data, userId) {
  requireWriter_(userId);
  const id = next_(SHEETS.OPINIONS, 'OPN');
  append_(SHEETS.OPINIONS, [id, data.topicId, userId, data.title, data.opinion, data.status, now_(), now_(), userId]);
  return { id };
}

function addDecision_(data, userId) {
  requireAdmin_(userId);
  const id = next_(SHEETS.DECISIONS, 'DEC');
  append_(SHEETS.DECISIONS, [id, data.topicId, userId, data.title, data.decision, data.reason, data.status, now_(), now_(), userId]);
  return { id };
}

function addFramework_(data, userId) {
  requireAdmin_(userId);
  const id = next_(SHEETS.FRAMEWORKS, 'FW');
  append_(SHEETS.FRAMEWORKS, [id, data.topicId, data.category, data.title, data.content, data.status, '0.1', now_(), now_(), userId]);
  return { id };
}

function addRoadmap_(data, userId) {
  requireAdmin_(userId);
  const id = next_(SHEETS.ROADMAP, 'ROAD');
  append_(SHEETS.ROADMAP, [id, data.topicId, data.title, data.status, Number(data.progress) || 0, data.ownerId, data.note || '', now_(), now_(), userId]);
  return { id };
}

function addTopic_(data, userId) {
  requireAdmin_(userId);
  const id = next_(SHEETS.TOPICS, 'TOPIC');
  append_(SHEETS.TOPICS, [id, data.title, data.description, data.ownerId, data.status, now_(), now_(), userId]);
  return { id };
}

function addMember_(data, userId) {
  requireAdmin_(userId);
  append_(SHEETS.MEMBERS, [data.id, data.ldapId, data.name, data.email || '', data.department || '', data.team || '', data.role, data.status, now_(), now_(), userId]);
  return { id: data.id };
}

function updateOpinion_(data, userId) {
  const row = getRowById_(SHEETS.OPINIONS, data.id).object;
  requireOwnerOrAdmin_(userId, row.AuthorID);
  return updateById_(SHEETS.OPINIONS, data.id, { TopicID: data.topicId, Title: data.title, Opinion: data.opinion, Status: data.status }, userId);
}

function deleteOpinion_(data, userId) {
  const row = getRowById_(SHEETS.OPINIONS, data.id).object;
  requireOwnerOrAdmin_(userId, row.AuthorID);
  deleteById_(SHEETS.OPINIONS, data.id);
  return { id: data.id };
}

function updateDecision_(data, userId) {
  requireAdmin_(userId);
  return updateById_(SHEETS.DECISIONS, data.id, { TopicID: data.topicId, Title: data.title, Decision: data.decision, Reason: data.reason, Status: data.status }, userId);
}

function deleteDecision_(data, userId) {
  requireAdmin_(userId);
  deleteById_(SHEETS.DECISIONS, data.id);
  return { id: data.id };
}

function updateFramework_(data, userId) {
  requireAdmin_(userId);
  return updateById_(SHEETS.FRAMEWORKS, data.id, { TopicID: data.topicId, Category: data.category, Title: data.title, Content: data.content, Status: data.status }, userId);
}

function deleteFramework_(data, userId) {
  requireAdmin_(userId);
  deleteById_(SHEETS.FRAMEWORKS, data.id);
  return { id: data.id };
}

function updateRoadmap_(data, userId) {
  requireAdmin_(userId);
  return updateById_(SHEETS.ROADMAP, data.id, { TopicID: data.topicId, Title: data.title, Status: data.status, Progress: Number(data.progress) || 0, OwnerID: data.ownerId, Note: data.note || '' }, userId);
}

function deleteRoadmap_(data, userId) {
  requireAdmin_(userId);
  deleteById_(SHEETS.ROADMAP, data.id);
  return { id: data.id };
}

function updateTopic_(data, userId) {
  requireAdmin_(userId);
  return updateById_(SHEETS.TOPICS, data.id, { Title: data.title, Description: data.description, OwnerID: data.ownerId, Status: data.status }, userId);
}

function deleteTopic_(data, userId) {
  requireAdmin_(userId);
  if (hasReference_(SHEETS.ROADMAP, 'TopicID', data.id) || hasReference_(SHEETS.DECISIONS, 'TopicID', data.id) || hasReference_(SHEETS.OPINIONS, 'TopicID', data.id) || hasReference_(SHEETS.FRAMEWORKS, 'TopicID', data.id)) {
    throw new Error('연결된 하위 항목이 있어 연구과제를 삭제할 수 없습니다.');
  }
  deleteById_(SHEETS.TOPICS, data.id);
  return { id: data.id };
}

function updateMember_(data, userId) {
  requireAdmin_(userId);
  return updateById_(SHEETS.MEMBERS, data.id, { LdapID: data.ldapId, Name: data.name, Email: data.email || '', Department: data.department || '', Team: data.team || '', Role: data.role, Status: data.status }, userId);
}

function deleteMember_(data, userId) {
  requireAdmin_(userId);
  if (String(data.id) === String(userId)) throw new Error('본인 계정은 삭제할 수 없습니다.');
  if (hasReference_(SHEETS.TOPICS, 'OwnerID', data.id) || hasReference_(SHEETS.ROADMAP, 'OwnerID', data.id) || hasReference_(SHEETS.DECISIONS, 'AuthorID', data.id) || hasReference_(SHEETS.OPINIONS, 'AuthorID', data.id)) {
    throw new Error('작성 또는 담당 이력이 있어 사용자를 삭제할 수 없습니다.');
  }
  deleteById_(SHEETS.MEMBERS, data.id);
  return { id: data.id };
}

function requireWriter_(userId) {
  const user = getActiveUser_(userId);
  if (!['admin', 'member'].includes(user.Role)) throw new Error('쓰기 권한이 없습니다.');
  return user;
}

function requireAdmin_(userId) {
  const user = getActiveUser_(userId);
  if (user.Role !== 'admin') throw new Error('관리자 권한이 필요합니다.');
  return user;
}

function requireOwnerOrAdmin_(userId, ownerId) {
  const user = getActiveUser_(userId);
  if (user.Role === 'admin' || String(user.ID) === String(ownerId)) return user;
  throw new Error('작성자 본인 또는 관리자만 처리할 수 있습니다.');
}

function getActiveUser_(userId) {
  const user = rows_(SHEETS.MEMBERS).find(member => String(member.ID) === String(userId));
  if (!user || user.Status !== '사용') throw new Error('사용 가능한 작성자 정보가 없습니다.');
  return user;
}

function getRowById_(sheetName, id) {
  if (!id) throw new Error('ID가 없습니다.');
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) throw new Error(sheetName + ' 시트가 없습니다.');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) throw new Error('대상 데이터를 찾지 못했습니다.');
  const headers = values[0];
  const idIndex = headers.indexOf('ID');
  if (idIndex < 0) throw new Error(sheetName + ' 시트에 ID 컬럼이 없습니다.');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      const object = {};
      headers.forEach((header, index) => object[header] = values[i][index]);
      return { sheet, headers, rowIndex: i + 1, object };
    }
  }
  throw new Error('대상 데이터를 찾지 못했습니다.');
}

function updateById_(sheetName, id, fields, userId) {
  const target = getRowById_(sheetName, id);
  const updates = Object.assign({}, fields, { UpdatedAt: now_(), UpdatedBy: userId });
  Object.entries(updates).forEach(([key, value]) => {
    const colIndex = target.headers.indexOf(key);
    if (colIndex >= 0) target.sheet.getRange(target.rowIndex, colIndex + 1).setValue(value);
  });
  return { id };
}

function deleteById_(sheetName, id) {
  const target = getRowById_(sheetName, id);
  target.sheet.deleteRow(target.rowIndex);
}

function hasReference_(sheetName, fieldName, value) {
  return rows_(sheetName).some(row => String(row[fieldName] || '') === String(value));
}

function migrateSchema() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEETS.MEMBERS);
  if (!sh) throw new Error('02_Members 시트가 없습니다. 신규 설치라면 setupSheets()를 먼저 실행하세요.');

  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  const idIndex = headers.indexOf('ID');
  let ldapIndex = headers.indexOf('LdapID');

  if (idIndex < 0) throw new Error('02_Members 시트에 ID 컬럼이 없습니다.');

  if (ldapIndex < 0) {
    sh.insertColumnAfter(idIndex + 1);
    sh.getRange(1, idIndex + 2).setValue('LdapID').setFontWeight('bold').setBackground('#f3f4f6');
    ldapIndex = idIndex + 1;
  }

  const lastRow = sh.getLastRow();
  if (lastRow >= 2) {
    const values = sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).getValues();
    for (let i = 0; i < values.length; i++) {
      const id = values[i][idIndex];
      const ldap = values[i][ldapIndex];
      if (id && !ldap) sh.getRange(i + 2, ldapIndex + 1).setValue(id);
    }
  }

  const settings = ss.getSheetByName(SHEETS.SETTINGS);
  if (settings) {
    const rows = settings.getDataRange().getDisplayValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === 'Version') settings.getRange(i + 1, 2).setValue('v1.0.0-rc3');
    }
  }

  return { ok: true, message: 'RC3 schema migration completed.' };
}

function checkWriteKey_(key) {
  const setting = rows_(SHEETS.SETTINGS).find(row => row.Key === 'WriteKey');
  return String(key || '') === String(setting?.Value || '');
}

function create_(ss, name, headers, rows) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  sh.clear();
  sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f3f4f6');
  if (rows.length) sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sh.autoResizeColumns(1, headers.length);
}

function rows_(name) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) return [];
  const values = sh.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(row => row.some(value => value !== '')).map(row => {
    const object = {};
    headers.forEach((header, index) => object[header] = row[index]);
    return object;
  });
}

function append_(name, row) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  sh.getRange(sh.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function next_(name, prefix) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  const last = sh.getLastRow();
  if (last < 2) return prefix + '-0001';
  const ids = sh.getRange(2, 1, last - 1, 1).getDisplayValues().flat();
  let max = 0;
  ids.forEach(id => {
    const match = String(id).match(/-(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  });
  return prefix + '-' + String(max + 1).padStart(4, '0');
}

function log_(action, user, payload) {
  const id = next_(SHEETS.AUDIT, 'LOG');
  append_(SHEETS.AUDIT, [id, action, user, payload, now_()]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function now_() {
  return Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
}
