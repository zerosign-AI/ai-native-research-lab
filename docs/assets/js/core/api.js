ANP.api = {
  async request(payload = {}) {
    const url = window.ANP_CONFIG?.API_URL;
    if (!url || url.includes('PASTE_YOUR_WEB_APP_URL')) throw new Error('config.js의 API_URL을 설정해주세요.');
    const isGet = !payload.action || payload.action === 'data';
    const res = await fetch(url, isGet ? { method: 'GET' } : {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.message || '요청 처리 중 오류가 발생했습니다.');
    return json;
  },
  async mutate(action, data) {
    return this.request({ action, writeKey: ANP.state.session.writeKey, userId: ANP.state.session.userId, data });
  }
};
