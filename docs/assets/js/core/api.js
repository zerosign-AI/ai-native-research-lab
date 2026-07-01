window.ANP = window.ANP || {};
ANP.api = {
  endpoint() {
    const url = window.ANP_CONFIG?.API_URL || '';
    if (!url || url.includes('PASTE_YOUR_WEB_APP_URL')) throw new Error('API URL이 설정되지 않았습니다. config.js를 확인하세요.');
    return url;
  },
  async request(params = {}) {
  const url = new URL(this.endpoint());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  console.log("Request URL:", url.toString());

  try {
    const res = await fetch(url.toString(), { method: 'GET' });

    console.log("Status:", res.status);
    console.log("OK:", res.ok);

    const text = await res.text();
    console.log("Response:", text);

    const json = JSON.parse(text);

    if (!json.ok) throw new Error(json.message || '요청에 실패했습니다.');

    return json;

  } catch (e) {
    console.error(e);
    throw e;
  }
},
  async mutate(action, payload = {}) {
    const body = {
      action,
      key: ANP.state.session.writeKey,
      userId: ANP.state.session.userId,
      payload
    };
    const res = await fetch(this.endpoint(), { method: 'POST', body: JSON.stringify(body) });
    const json = await res.json();
    if (!json.ok) throw new Error(json.message || '저장하지 못했습니다.');
    return json;
  }
};
