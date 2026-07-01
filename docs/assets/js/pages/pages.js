dashboard() {
  const d = ANP.state.data || {};
  const selectedTopicId = ANP.state.currentTopicId;
  const selectedTopic = (d.topics || []).find(t => t.ID === selectedTopicId);

  const topics = selectedTopic ? [selectedTopic] : (d.topics || []);
  const roadmap = this.scoped(d.roadmap || []);
  const decisions = this.scoped(d.decisions || []);
  const opinions = this.scoped(d.opinions || []);
  const frameworks = this.scoped(d.frameworks || []);

  const done = roadmap.filter(r => r.Status === '완료').length;
  const inProgress = roadmap.filter(r => r.Status === '진행중').length;
  const avg = roadmap.length
    ? Math.round(roadmap.reduce((s, r) => s + (Number(r.Progress) || 0), 0) / roadmap.length)
    : 0;

  const currentRoadmap =
    roadmap.find(r => r.Status === '진행중') ||
    roadmap[0] ||
    null;

  return `
    <div class="section-stack">

      <div class="card dashboard-hero">
        <div class="card-head">
          <div>
            <h2>현재 연구 상태</h2>
            <p class="page-desc">
              ${selectedTopic ? ANP.ui.esc(selectedTopic.Title) : '전체 연구과제'} 기준으로 현재 진행 상황을 확인합니다.
            </p>
          </div>
          <div>${ANP.ui.badge(selectedTopic?.Status || '전체')}</div>
        </div>

        <div class="dashboard-hero-grid">
          <div>
            <div class="summary-label">현재 연구과제</div>
            <div class="summary-value">${ANP.ui.esc(selectedTopic?.Title || '전체 연구과제')}</div>
            <div class="summary-desc">${ANP.ui.esc(selectedTopic?.Description || '등록된 모든 연구과제를 통합해서 봅니다.')}</div>
          </div>

          <div>
            <div class="summary-label">현재 단계</div>
            <div class="summary-value">${ANP.ui.esc(currentRoadmap?.Title || '-')}</div>
            <div class="summary-desc">${ANP.ui.esc(currentRoadmap?.Note || '진행 중인 로드맵이 없습니다.')}</div>
          </div>

          <div>
            <div class="summary-label">로드맵 진행률</div>
            <div class="summary-value">${avg}%</div>
            <div class="progress"><div style="width:${avg}%"></div></div>
            <div class="summary-desc">${done}/${roadmap.length} 완료 · 진행중 ${inProgress}</div>
          </div>
        </div>
      </div>

      <div class="grid cols-4">
        ${ANP.ui.metric('연구과제', topics.length, selectedTopic ? '선택된 연구과제' : '등록된 전체 연구과제')}
        ${ANP.ui.metric('로드맵', roadmap.length, `완료 ${done} · 진행중 ${inProgress}`)}
        ${ANP.ui.metric('의사결정', decisions.length, '선택 범위 기준')}
        ${ANP.ui.metric('의견', opinions.length, '선택 범위 기준')}
      </div>

      <div class="grid cols-2">
        <div class="card">
          <div class="card-head"><h2>현재 로드맵</h2></div>
          ${currentRoadmap ? `
            <div class="dashboard-item">
              <div class="td-title">${ANP.ui.esc(currentRoadmap.Title)}</div>
              <div class="page-desc td-pre">${ANP.ui.esc(currentRoadmap.Note || '')}</div>
              <div class="dashboard-item-footer">
                ${ANP.ui.badge(currentRoadmap.Status)}
                <span>${ANP.ui.esc(currentRoadmap.OwnerName || '-')}</span>
              </div>
              ${ANP.ui.progress(currentRoadmap.Progress)}
            </div>
          ` : `<div class="empty">등록된 로드맵이 없습니다.</div>`}
        </div>

        <div class="card">
          <div class="card-head"><h2>최근 프레임워크</h2></div>
          ${this.recent(frameworks, 'Title', 'Content')}
        </div>
      </div>

      <div class="grid cols-2">
        <div class="card">
          <div class="card-head"><h2>최근 의사결정</h2></div>
          ${this.recent(decisions, 'Title', 'Decision')}
        </div>

        <div class="card">
          <div class="card-head"><h2>최근 의견</h2></div>
          ${this.recent(opinions, 'Title', 'Opinion')}
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h2>다음 작업</h2>
            <p class="page-desc">현재 단계에서 팀이 이어서 작성하거나 검토할 항목입니다.</p>
          </div>
        </div>
        <div class="quick-actions">
          <button class="btn btn-primary" data-add="opinion">의견 등록</button>
          <button class="btn btn-secondary" data-add="decision">의사결정 등록</button>
          <button class="btn btn-tertiary" data-add="roadmap">로드맵 추가</button>
          <button class="btn btn-tertiary" data-add="framework">프레임워크 추가</button>
        </div>
      </div>

    </div>
  `;
},
