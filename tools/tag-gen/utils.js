const META_TEMPLATE = `
  <div class="metadata">
    <div>
      <div>tags</div>
      <div></div>
    </div>
  </div>`;

function getOpts(token, method = 'GET') {
  return {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function fetchDoc(path, token) {
  const opts = getOpts(token);
  const resp = await fetch(`https://admin.da.live/source${path}.html`, opts);
  if (!resp.ok) return { message: 'Could not fetch doc.', status: resp.status };
  const html = await resp.text();
  return { html };
}

const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && text) rdx[key] = { text };
  }
  return rdx;
}, {});

export async function loadGenTags(path, token) {
  const { html } = await fetchDoc(path, token);
  const baseOpts = getOpts(token, 'POST');
  const opts = { ...baseOpts, body: JSON.stringify({ html }) };
  const resp = await fetch(`https://da-etc.adobeaem.workers.dev/tags`, opts);
  if (!resp.ok) return [];
  const { tags } = await resp.json();
  return tags;
}

export async function loadPageTags(path, token) {
  const { html } = await fetchDoc(path, token);
  if (!html) return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const metaEl = doc.querySelector('.metadata');
  if (metaEl) {
    const { tags } = getMetadata(metaEl);
    if (tags) {
      return tags.text.split(',').map((tag) => tag.trim().toLowerCase());
    }
  }
  return [];
}
