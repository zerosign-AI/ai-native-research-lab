ANP.api = {
  get baseUrl() {
    return (window.ANP_CONFIG?.API_URL || '').trim();
  },

  async request(params = {}) {
    if (!this.baseUrl || this.baseUrl.includes('PASTE_APPS_SCRIPT')) {
      throw new Error('API_URL이 설정되지 않았습니다. docs/config.js를 확인하세요.');
    }
    const url = new URL(this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
    const res = await fetch(url.toString(), { method: 'GET' });
    if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
    const json = await res.json();
    if (json.ok === false) throw new Error(json.message || '요청을 처리하지 못했습니다.');
    return json;
  },

  async mutate(action, payload = {}) {
    if (!this.baseUrl || this.baseUrl.includes('PASTE_APPS_SCRIPT')) {
      throw new Error('API_URL이 설정되지 않았습니다. docs/config.js를 확인하세요.');
    }
    const body = {
      action,
      key: ANP.state.session.writeKey,
      userId: ANP.state.session.userId,
      payload
    };
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('저장 요청을 보내지 못했습니다.');
    const json = await res.json();
    if (json.ok === false) throw new Error(json.message || '요청을 처리하지 못했습니다.');
    return json;
  }
};
