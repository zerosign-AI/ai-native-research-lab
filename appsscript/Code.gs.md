const SHEETS = {
  SETTINGS: '00_Settings', MENU: '01_Menu', MEMBERS: '02_Members', TOPICS: '03_Research_Topic', ROADMAP: '04_Roadmap', DECISIONS: '05_Decision', OPINIONS: '06_Opinion', FRAMEWORKS: '07_Framework', CODES: '08_Code', AUDIT: '09_Audit_Log'
};
function doGet(e){ return json_({ ok:true, data:getBoardData_() }); }
function doPost(e){ try { const p = JSON.parse(e.postData.contents || '{}'); const data = p.data || {}; const userId = String(p.userId || ''); if (!checkWriteKey_(p.writeKey)) return json_({ok:false,message:'팀 암호가 올바르지 않습니다.'}); if (!userId) return json_({ok:false,message:'작성자 정보가 없습니다.'}); const action = p.action; let res; if(action==='addOpinion') res = addOpinion_(data,userId); else if(action==='addDecision') res = addDecision_(data,userId); else if(action==='addFramework') res = addFramework_(data,userId); else if(action==='addRoadmap') res = addRoadmap_(data,userId); else if(action==='addTopic') res = addTopic_(data,userId); else if(action==='addMember') res = addMember_(data,userId); else return json_({ok:false,message:'지원하지 않는 요청입니다.'}); log_(action,userId,JSON.stringify(data)); return json_({ok:true,data:res}); } catch(err){ return json_({ok:false,message:err.message || String(err)}); } }
function setupSheets(){ const ss=SpreadsheetApp.getActive(); create_(ss,SHEETS.SETTINGS,['Key','Value','Description','UpdatedAt','UpdatedBy'],[['SystemName','AI Native Platform','화면에 표시되는 시스템명',now_(),'system'],['AppName','Research Lab','첫 번째 앱 이름',now_(),'system'],['OrganizationName','조직명을 입력하세요','사용 조직명',now_(),'system'],['TeamName','팀명을 입력하세요','사용 팀명',now_(),'system'],['Version','v1.0.0-rc3','제품 버전',now_(),'system'],['WriteKey','axplanning','입력 권한 검증용 팀 암호',now_(),'system'],['UserKeyLabel','사번','사용자 식별키 화면 표시명',now_(),'system']]); create_(ss,SHEETS.MENU,['ID','Label','Enabled','Order','Role','Description','UpdatedAt','UpdatedBy'],[['dashboard','대시보드','Y',1,'viewer','전체 현황',now_(),'system'],['topics','연구과제','Y',2,'member','연구과제 관리',now_(),'system'],['roadmap','로드맵','Y',3,'member','진행 단계 관리',now_(),'system'],['opinion','의견','Y',4,'member','팀 의견 관리',now_(),'system'],['decision','의사결정','Y',5,'member','결정 기록 관리',now_(),'system'],['framework','프레임워크','Y',6,'member','구조화된 연구 결과 관리',now_(),'system'],['settings','설정','Y',90,'admin','시스템 설정',now_(),'system'],['members','권한관리','Y',99,'admin','사용자/권한 관리',now_(),'system']]); create_(ss,SHEETS.MEMBERS,['ID','LdapID','Name','Email','Department','Team','Role','Status','CreatedAt','UpdatedAt','UpdatedBy'],[['admin','admin','관리자','admin@example.com','','','admin','사용',now_(),now_(),'system'],['member','member','팀원','member@example.com','','','member','사용',now_(),now_(),'system']]); create_(ss,SHEETS.TOPICS,['ID','Title','Description','OwnerID','Status','CreatedAt','UpdatedAt','UpdatedBy'],[['TOPIC-0001','AX기획팀 AI Native 전환','AX기획팀의 업무영역별 AI Native 전환 방법을 연구한다.','admin','진행중',now_(),now_(),'system'],['TOPIC-0002','AI Native 평가전략','AI Native 업무와 조직의 평가 기준을 연구한다.','admin','진행중',now_(),now_(),'system']]); create_(ss,SHEETS.ROADMAP,['ID','TopicID','Title','Status','Progress','OwnerID','Note','CreatedAt','UpdatedAt','UpdatedBy'],[['ROAD-0001','TOPIC-0001','현재 업무 분석','진행중',30,'admin','업무영역 목록 정리',now_(),now_(),'system'],['ROAD-0002','TOPIC-0001','AI 도입 방식 분석','초안',0,'admin','지침/하네스/AI 구성원 구분',now_(),now_(),'system']]); create_(ss,SHEETS.DECISIONS,['ID','TopicID','AuthorID','Title','Decision','Reason','Status','CreatedAt','UpdatedAt','UpdatedBy'],[['DEC-0001','TOPIC-0001','admin','문서 언어 원칙','문서는 한글을 기본으로 작성하고 필요한 전문용어는 영어를 유지한다.','한글 사용자 중심의 협업을 위해서다.','승인',now_(),now_(),'system']]); create_(ss,SHEETS.OPINIONS,['ID','TopicID','AuthorID','Title','Opinion','Status','CreatedAt','UpdatedAt','UpdatedBy'],[['OPN-0001','TOPIC-0001','admin','업무영역별 AI 도입 방식','업무영역별로 지침, 하네스, AI 구성원, 지식, 평가 기준을 분석한다.','열림',now_(),now_(),'system']]); create_(ss,SHEETS.FRAMEWORKS,['ID','TopicID','Category','Title','Content','Status','Version','CreatedAt','UpdatedAt','UpdatedBy'],[['FW-0001','TOPIC-0001','정의','AI Native','AI를 기존 업무에 추가하는 것이 아니라, AI와 사람이 함께 일하는 것을 전제로 업무·조직·운영 방식을 재설계하는 접근이다.','초안','0.1',now_(),now_(),'system']]); create_(ss,SHEETS.CODES,['ID','Group','Label','Value','Order','Enabled','UpdatedAt','UpdatedBy'],[['CODE-0001','TOPIC_STATUS','진행중','진행중',1,'Y',now_(),'system'],['CODE-0002','TOPIC_STATUS','보류','보류',2,'Y',now_(),'system'],['CODE-0003','TOPIC_STATUS','완료','완료',3,'Y',now_(),'system'],['CODE-0004','ROADMAP_STATUS','초안','초안',1,'Y',now_(),'system'],['CODE-0005','ROADMAP_STATUS','진행중','진행중',2,'Y',now_(),'system'],['CODE-0006','ROADMAP_STATUS','검토','검토',3,'Y',now_(),'system'],['CODE-0007','ROADMAP_STATUS','완료','완료',4,'Y',now_(),'system'],['CODE-0008','OPINION_STATUS','열림','열림',1,'Y',now_(),'system'],['CODE-0009','OPINION_STATUS','검토','검토',2,'Y',now_(),'system'],['CODE-0010','OPINION_STATUS','종료','종료',3,'Y',now_(),'system'],['CODE-0011','DECISION_STATUS','초안','초안',1,'Y',now_(),'system'],['CODE-0012','DECISION_STATUS','승인','승인',2,'Y',now_(),'system'],['CODE-0013','DECISION_STATUS','반려','반려',3,'Y',now_(),'system'],['CODE-0014','FRAMEWORK_STATUS','초안','초안',1,'Y',now_(),'system'],['CODE-0015','FRAMEWORK_STATUS','검토','검토',2,'Y',now_(),'system'],['CODE-0016','FRAMEWORK_STATUS','승인','승인',3,'Y',now_(),'system'],['CODE-0017','USER_ROLE','관리자','admin',1,'Y',now_(),'system'],['CODE-0018','USER_ROLE','멤버','member',2,'Y',now_(),'system'],['CODE-0019','USER_ROLE','뷰어','viewer',3,'Y',now_(),'system'],['CODE-0020','USER_STATUS','사용','사용',1,'Y',now_(),'system'],['CODE-0021','USER_STATUS','미사용','미사용',2,'Y',now_(),'system']]); create_(ss,SHEETS.AUDIT,['ID','Action','UserID','Payload','CreatedAt'],[]); return {ok:true}; }
function getBoardData_(){ const data={settings:rows_(SHEETS.SETTINGS),menu:rows_(SHEETS.MENU),members:rows_(SHEETS.MEMBERS),topics:rows_(SHEETS.TOPICS),roadmap:rows_(SHEETS.ROADMAP),decisions:rows_(SHEETS.DECISIONS).reverse(),opinions:rows_(SHEETS.OPINIONS).reverse(),frameworks:rows_(SHEETS.FRAMEWORKS),codes:rows_(SHEETS.CODES).sort((a,b)=>Number(a.Order||0)-Number(b.Order||0))}; enrich_(data); return data; }
function enrich_(d){ const mem=Object.fromEntries((d.members||[]).map(m=>[m.ID,m])); const topics=Object.fromEntries((d.topics||[]).map(t=>[t.ID,t])); const role=Object.fromEntries((d.codes||[]).filter(c=>c.Group==='USER_ROLE').map(c=>[c.Value,c.Label])); (d.members||[]).forEach(m=>{m.RoleLabel=role[m.Role]||m.Role; m.LdapDisplay=(m.LdapID||m.ID)+' ('+(m.Name||'-')+')';}); ['topics','roadmap','decisions','opinions','frameworks'].forEach(k=>(d[k]||[]).forEach(r=>{ if(r.OwnerID) r.OwnerName=mem[r.OwnerID]?.Name||r.OwnerID; if(r.AuthorID) r.AuthorName=mem[r.AuthorID]?.Name||r.AuthorID; if(r.TopicID) r.TopicTitle=topics[r.TopicID]?.Title||r.TopicID; })); }
function addOpinion_(d,u){ const id=next_(SHEETS.OPINIONS,'OPN'); append_(SHEETS.OPINIONS,[id,d.topicId,u,d.title,d.opinion,d.status,now_(),now_(),u]); return {id}; }
function addDecision_(d,u){ const id=next_(SHEETS.DECISIONS,'DEC'); append_(SHEETS.DECISIONS,[id,d.topicId,u,d.title,d.decision,d.reason,d.status,now_(),now_(),u]); return {id}; }
function addFramework_(d,u){ const id=next_(SHEETS.FRAMEWORKS,'FW'); append_(SHEETS.FRAMEWORKS,[id,d.topicId,d.category,d.title,d.content,d.status,'0.1',now_(),now_(),u]); return {id}; }
function addRoadmap_(d,u){ const id=next_(SHEETS.ROADMAP,'ROAD'); append_(SHEETS.ROADMAP,[id,d.topicId,d.title,d.status,Number(d.progress)||0,d.ownerId,d.note||'',now_(),now_(),u]); return {id}; }
function addTopic_(d,u){ const id=next_(SHEETS.TOPICS,'TOPIC'); append_(SHEETS.TOPICS,[id,d.title,d.description,d.ownerId,d.status,now_(),now_(),u]); return {id}; }
function addMember_(d,u){ append_(SHEETS.MEMBERS,[d.id,d.ldapId,d.name,d.email||'',d.department||'',d.team||'',d.role,d.status,now_(),now_(),u]); return {id:d.id}; }


/**
 * 기존 v1.0/v1.0-rc1 시트를 유지하면서 RC3 스키마로 보정합니다.
 * - 02_Members 시트에 LdapID 컬럼이 없으면 ID 뒤에 추가합니다.
 * - 기존 사용자의 LdapID가 비어 있으면 ID 값을 기본값으로 채웁니다.
 * - 기존 데이터는 삭제하지 않습니다.
 */
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

function checkWriteKey_(key){ const s=rows_(SHEETS.SETTINGS).find(r=>r.Key==='WriteKey'); return String(key||'') === String(s?.Value||''); }
function create_(ss,name,headers,rows){ let sh=ss.getSheetByName(name); if(!sh) sh=ss.insertSheet(name); sh.clear(); sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#f3f4f6'); if(rows.length) sh.getRange(2,1,rows.length,headers.length).setValues(rows); sh.autoResizeColumns(1,headers.length); }
function rows_(name){ const sh=SpreadsheetApp.getActive().getSheetByName(name); if(!sh) return []; const values=sh.getDataRange().getDisplayValues(); if(values.length<2) return []; const h=values[0]; return values.slice(1).filter(r=>r.some(v=>v!=='')).map(r=>{const o={};h.forEach((x,i)=>o[x]=r[i]);return o;}); }
function append_(name,row){ const sh=SpreadsheetApp.getActive().getSheetByName(name); sh.getRange(sh.getLastRow()+1,1,1,row.length).setValues([row]); }
function next_(name,prefix){ const sh=SpreadsheetApp.getActive().getSheetByName(name); const last=sh.getLastRow(); if(last<2) return prefix+'-0001'; const ids=sh.getRange(2,1,last-1,1).getDisplayValues().flat(); let max=0; ids.forEach(id=>{const m=String(id).match(/-(\d+)$/); if(m) max=Math.max(max,Number(m[1]));}); return prefix+'-'+String(max+1).padStart(4,'0'); }
function log_(action,user,payload){ const id=next_(SHEETS.AUDIT,'LOG'); append_(SHEETS.AUDIT,[id,action,user,payload,now_()]); }
function json_(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function now_(){ return Utilities.formatDate(new Date(),'Asia/Seoul','yyyy-MM-dd HH:mm:ss'); }
