import { getStore } from '@netlify/blobs';

/**
 * Cloud storage for published invitations, so share links stay short and
 * open on any device:  POST /api/invite {state} → {id};  GET /api/invite?id=…
 */

const MAX_BYTES = 5.5 * 1024 * 1024; // Netlify function payloads cap at 6 MB
const ID_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
const ID_PATTERN = /^[a-z0-9]{10}$/;

const json = (body, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': cache }
  });

function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
}

export default async (req) => {
  const store = getStore('invitations');

  if (req.method === 'GET') {
    const id = new URL(req.url).searchParams.get('id') || '';
    if (!ID_PATTERN.test(id)) return json({ error: 'Invalid invitation id' }, 400);
    const record = await store.get(id, { type: 'json' });
    if (!record) return json({ error: 'Invitation not found' }, 404);
    // Published invitations never change, so phones can cache them briefly
    return json(record, 200, 'public, max-age=300');
  }

  if (req.method === 'POST') {
    const text = await req.text();
    if (text.length > MAX_BYTES) {
      return json({ error: 'Invitation is too large. Remove some photos and try again.' }, 413);
    }
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: 'Invalid invitation data' }, 400);
    }
    if (!body?.state || typeof body.state !== 'object') {
      return json({ error: 'Missing invitation data' }, 400);
    }
    const id = newId();
    await store.setJSON(id, { state: body.state, createdAt: new Date().toISOString() });
    return json({ id }, 201);
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = { path: '/api/invite' };
