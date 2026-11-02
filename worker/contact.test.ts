// Run with: npm test (node --test, native TypeScript type stripping).
// Every outbound call is mocked: these tests never reach Turnstile or Resend,
// so no email can be sent.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, escapeHtml, RESEND_URL, TURNSTILE_VERIFY_URL, type ContactEnv } from './contact.ts';

type Call = { url: string; init?: RequestInit };
let calls: Call[] = [];
let turnstileSuccess = true;
let resendStatus = 200;
const realFetch = globalThis.fetch;
const realLog = console.log;
let logs: string[] = [];

beforeEach(() => {
  calls = [];
  logs = [];
  turnstileSuccess = true;
  resendStatus = 200;
  console.log = (line: string) => void logs.push(line);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url === TURNSTILE_VERIFY_URL) return Response.json({ success: turnstileSuccess });
    if (url === RESEND_URL) return new Response('{}', { status: resendStatus });
    throw new Error(`unexpected fetch ${url}`);
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  console.log = realLog;
});

function env(overrides: Partial<ContactEnv> = {}): ContactEnv {
  return {
    RESEND_API_KEY: 'test-resend-key',
    TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
    TURNSTILE_SITE_KEY: 'test-site-key',
    FORM_RECIPIENT: 'recipient@example.test',
    FORM_SENDER: 'Site <sender@example.test>',
    ...overrides,
  };
}

const valid = {
  name: 'Jean Tremblay',
  email: 'jean@example.test',
  phone: '',
  message: 'Bonjour <b>Waycha</b>',
  consent: true,
  turnstileToken: 'token',
  company_website: '',
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://lepicuriennebywaycha.ca/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const resendCalls = () => calls.filter((c) => c.url === RESEND_URL);

test('valid contact submission is sent once through Resend, visitor as reply_to only', async () => {
  const res = await handleContact(post(valid), env());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(resendCalls().length, 1);
  const payload = JSON.parse(String(resendCalls()[0].init?.body));
  assert.deepEqual(payload.to, ['recipient@example.test']);
  assert.equal(payload.from, 'Site <sender@example.test>');
  assert.equal(payload.reply_to, 'jean@example.test');
  assert.equal(payload.subject, "Nouveau message du site lepicuriennebywaycha.ca (L'Épicurienne By Waycha)");
  assert.ok(payload.html.includes('Bonjour &lt;b&gt;Waycha&lt;/b&gt;'), 'HTML is escaped');
  assert.ok(!payload.html.includes('<b>Waycha</b>'));
});

for (const missing of ['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY', 'FORM_RECIPIENT', 'FORM_SENDER'] as const) {
  test(`unset ${missing} returns 503 and calls nothing`, async () => {
    const res = await handleContact(post(valid), env({ [missing]: undefined }));
    assert.equal(res.status, 503);
    assert.equal(calls.length, 0);
  });
}

test('missing Turnstile token is rejected without calling Resend', async () => {
  const res = await handleContact(post({ ...valid, turnstileToken: '' }), env());
  assert.equal(res.status, 403);
  assert.equal(resendCalls().length, 0);
});

test('invalid Turnstile token is rejected without calling Resend', async () => {
  turnstileSuccess = false;
  const res = await handleContact(post(valid), env());
  assert.equal(res.status, 403);
  assert.equal(resendCalls().length, 0);
});

test('unreachable siteverify fails closed', async () => {
  globalThis.fetch = (async () => {
    throw new Error('network down');
  }) as typeof fetch;
  const res = await handleContact(post(valid), env());
  assert.equal(res.status, 403);
});

test('missing consent is rejected', async () => {
  for (const consent of [false, undefined, 'true', 1]) {
    calls = [];
    const res = await handleContact(post({ ...valid, consent }), env());
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'consent_required');
    assert.equal(resendCalls().length, 0);
  }
});

test('invalid email is rejected', async () => {
  const res = await handleContact(post({ ...valid, email: 'pas-un-courriel' }), env());
  assert.equal(res.status, 422);
  assert.equal((await res.json()).error, 'invalid:email');
  assert.equal(resendCalls().length, 0);
});

test('required fields and max lengths are enforced', async () => {
  const cases: Array<[Record<string, unknown>, string]> = [
    [{ name: '' }, 'missing:name'],
    [{ name: 42 }, 'missing:name'],
    [{ message: '   ' }, 'missing:message'],
    [{ name: 'a'.repeat(101) }, 'too_long:name'],
    [{ phone: '1'.repeat(31) }, 'too_long:phone'],
    [{ message: 'a'.repeat(5001) }, 'too_long:message'],
    [{ email: '' }, 'missing:email'],
    [{ email: 'a@b.c' + 'a'.repeat(250) }, 'too_long:email'],
  ];
  for (const [patch, error] of cases) {
    const res = await handleContact(post({ ...valid, ...patch }), env());
    assert.equal(res.status, 422, error);
    assert.equal((await res.json()).error, error);
  }
  assert.equal(resendCalls().length, 0);
});

test('control characters are stripped from fields', async () => {
  await handleContact(post({ ...valid, name: 'Jean\u0000\u0007 Tremblay' }), env());
  const payload = JSON.parse(String(resendCalls()[0].init?.body));
  assert.ok(payload.text.includes('Nom : Jean Tremblay'));
});

test('filled honeypot returns 200 without sending', async () => {
  const res = await handleContact(post({ ...valid, company_website: 'https://spam.example' }), env());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(resendCalls().length, 0);
});

test('rate limit returns 429 before any outbound call', async () => {
  const res = await handleContact(
    post(valid),
    env({ CONTACT_LIMITER: { limit: async () => ({ success: false }) } }),
  );
  assert.equal(res.status, 429);
  assert.equal((await res.json()).error, 'rate_limited');
  assert.equal(calls.length, 0);
});

test('rate limit is keyed on the visitor IP', async () => {
  let key = '';
  await handleContact(
    post(valid),
    env({ CONTACT_LIMITER: { limit: async (o) => ((key = o.key), { success: true }) } }),
  );
  assert.equal(key, 'contact:203.0.113.7');
});

test('Resend refusal surfaces as 502, never as success', async () => {
  resendStatus = 500;
  const res = await handleContact(post(valid), env());
  assert.equal(res.status, 502);
  assert.equal((await res.json()).ok, false);
});

test('bad bodies are rejected', async () => {
  assert.equal((await handleContact(post('not json'), env())).status, 400);
  assert.equal((await handleContact(post([1, 2]), env())).status, 400);
  assert.equal((await handleContact(post({ ...valid, message: 'a'.repeat(20000) }), env())).status, 413);
  const form = new Request('https://lepicuriennebywaycha.ca/api/contact', { method: 'POST', body: 'a=b' });
  assert.equal((await handleContact(form, env())).status, 415);
  assert.equal(resendCalls().length, 0);
});

test('GET returns the public site key only; other methods 405', async () => {
  const res = await handleContact(new Request('https://lepicuriennebywaycha.ca/api/contact'), env());
  assert.deepEqual(await res.json(), { ok: true, turnstileSiteKey: 'test-site-key' });
  const put = await handleContact(new Request('https://lepicuriennebywaycha.ca/api/contact', { method: 'PUT' }), env());
  assert.equal(put.status, 405);
});

test('logs carry a request id and status, never submitted data', async () => {
  await handleContact(post(valid), env());
  assert.equal(logs.length, 1);
  const entry = JSON.parse(logs[0]);
  assert.deepEqual(Object.keys(entry).sort(), ['rid', 'status']);
  assert.ok(!logs[0].includes('jean@example.test'));
});

test('responses carry no-store and nosniff', async () => {
  const res = await handleContact(post(valid), env());
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
});

test('escapeHtml covers the five HTML metacharacters', () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
});
