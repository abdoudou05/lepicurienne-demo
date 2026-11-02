/**
 * POST /api/contact: the only server code on lepicuriennebywaycha.ca.
 *
 * Delivers the "Restons en Contact" form by email through Resend and keeps
 * nothing: no database, no KV, and logs carry a request id and a status code
 * only, never a name, email, phone or message.
 *
 * Order of checks, each one cheap before the next:
 *   1. configuration (fail closed with 503, never a hard-coded fallback)
 *   2. per-IP rate limit (429)
 *   3. body parsing (400 / 413 / 415)
 *   4. Turnstile siteverify (403, fail closed)
 *   5. honeypot (200 with nothing sent, so bots learn nothing)
 *   6. consent and field validation (400 / 422)
 *   7. Resend (200, or 502 when Resend refuses)
 *
 * GET /api/contact returns the public Turnstile site key, so one static build
 * works with the preview and the production key alike.
 */

export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface ContactEnv {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  /** Where submissions go. The only place the destination address lives. */
  FORM_RECIPIENT?: string;
  /** Verified webryk.ca sender, for example "Site L'Épicurienne <contact@webryk.ca>". */
  FORM_SENDER?: string;
  CONTACT_LIMITER?: RateLimiter;
}

export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
export const RESEND_URL = 'https://api.resend.com/emails';

const BUSINESS_NAME = "L'Épicurienne By Waycha";
const MAX_BODY_CHARS = 16 * 1024;
const LIMITS = { name: 100, email: 254, phone: 30, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// C0 controls except tab and newline, DEL, C1 controls.
const CONTROL_RE = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;

interface Submission {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const SECURITY_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000',
};

function json(rid: string, status: number, body: Record<string, unknown>): Response {
  // Request id and status only: nothing the visitor typed ever reaches a log.
  console.log(JSON.stringify({ rid, status }));
  return new Response(JSON.stringify(body), { status, headers: SECURITY_HEADERS });
}

/** Non-strings become '', control characters go, whitespace is trimmed. */
function clean(value: unknown, keepNewlines = false): string {
  if (typeof value !== 'string') return '';
  let out = value.replace(/\r\n?/g, '\n').replace(CONTROL_RE, '');
  if (!keepNewlines) out = out.replace(/[\n\t]+/g, ' ');
  return out.trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Validation = { ok: true; data: Submission } | { ok: false; error: string };

export function validate(body: Record<string, unknown>): Validation {
  if (body.consent !== true) return { ok: false, error: 'consent_required' };

  const data: Submission = {
    name: clean(body.name),
    email: clean(body.email),
    phone: clean(body.phone),
    message: clean(body.message, true),
  };

  for (const field of ['name', 'email', 'phone', 'message'] as const) {
    if (data[field].length > LIMITS[field]) return { ok: false, error: `too_long:${field}` };
  }
  if (!data.name) return { ok: false, error: 'missing:name' };
  if (!data.email) return { ok: false, error: 'missing:email' };
  if (!EMAIL_RE.test(data.email)) return { ok: false, error: 'invalid:email' };
  if (!data.message) return { ok: false, error: 'missing:message' };
  return { ok: true, data };
}

async function verifyTurnstile(token: unknown, secret: string, ip: string): Promise<boolean> {
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const form = new FormData();
  form.set('secret', secret);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
    if (!res.ok) return false;
    const outcome = (await res.json()) as { success?: boolean };
    return outcome.success === true;
  } catch {
    // Unreachable siteverify fails closed: the visitor sees the error message
    // with the email address and can still write directly.
    return false;
  }
}

export function buildEmail(data: Submission, siteHost: string) {
  const subject = `Nouveau message du site ${siteHost} (${BUSINESS_NAME})`;

  const rows: Array<[string, string]> = [
    ['Nom', data.name],
    ['Courriel', data.email],
    ['Téléphone', data.phone || '(non fourni)'],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label} : ${value}`),
    '',
    `Message :\n${data.message}`,
    '',
    `Envoyé depuis ${siteHost}. Répondez directement à ce courriel pour écrire à la personne.`,
    "Le visiteur a consenti à l'utilisation de ses renseignements pour répondre à sa demande.",
  ].join('\n');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#111">
<h2 style="margin:0 0 12px">${escapeHtml(subject)}</h2>
<table cellpadding="4" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
    )
    .join('')}</table>
<p style="font-weight:bold;margin:16px 0 4px">Message</p>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
<p style="color:#666;font-size:12px;margin-top:24px">Envoyé depuis ${escapeHtml(siteHost)}. Répondez directement à ce courriel pour écrire à la personne. Le visiteur a consenti à l'utilisation de ses renseignements pour répondre à sa demande.</p>
</div>`;

  return { subject, text, html };
}

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  const rid = request.headers.get('cf-ray') || crypto.randomUUID();

  if (request.method === 'GET') {
    if (!env.TURNSTILE_SITE_KEY) return json(rid, 503, { ok: false, error: 'unavailable' });
    return json(rid, 200, { ok: true, turnstileSiteKey: env.TURNSTILE_SITE_KEY });
  }
  if (request.method !== 'POST') return json(rid, 405, { ok: false, error: 'method_not_allowed' });

  // 1. Configuration. Any missing value fails closed: no hard-coded fallback.
  const { RESEND_API_KEY, TURNSTILE_SECRET_KEY, FORM_RECIPIENT, FORM_SENDER } = env;
  if (!RESEND_API_KEY || !TURNSTILE_SECRET_KEY || !FORM_RECIPIENT || !FORM_SENDER) {
    return json(rid, 503, { ok: false, error: 'unavailable' });
  }

  // 2. Rate limit per IP, before any outbound call.
  const ip = request.headers.get('cf-connecting-ip') || '';
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: `contact:${ip || 'unknown'}` });
    if (!success) return json(rid, 429, { ok: false, error: 'rate_limited' });
  }

  // 3. Body: JSON object, bounded size.
  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return json(rid, 415, { ok: false, error: 'unsupported_media_type' });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json(rid, 413, { ok: false, error: 'too_large' });
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json(rid, 400, { ok: false, error: 'invalid_json' });
  }

  // 4. Turnstile, fail closed.
  if (!(await verifyTurnstile(body.turnstileToken, TURNSTILE_SECRET_KEY, ip))) {
    return json(rid, 403, { ok: false, error: 'turnstile_failed' });
  }

  // 5. Honeypot: answer like a success, send nothing.
  if (clean(body.company_website)) return json(rid, 200, { ok: true });

  // 6. Consent and fields.
  const result = validate(body);
  if (!result.ok) {
    return json(rid, result.error === 'consent_required' ? 400 : 422, { ok: false, error: result.error });
  }

  // 7. Delivery. The visitor's address is reply_to only, never from.
  const siteHost = new URL(request.url).hostname;
  const { subject, text, html } = buildEmail(result.data, siteHost);
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FORM_SENDER,
        to: [FORM_RECIPIENT],
        reply_to: result.data.email,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) return json(rid, 502, { ok: false, error: 'delivery_failed' });
  } catch {
    return json(rid, 502, { ok: false, error: 'delivery_failed' });
  }
  return json(rid, 200, { ok: true });
}
