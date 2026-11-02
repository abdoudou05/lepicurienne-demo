// Client side of POST /api/contact (worker/contact.ts). Success is only ever
// reported after the endpoint answers 2xx; anything else is an error that
// points the visitor to the email address below.

/** Address shown to visitors when sending fails. Display copy only: where
 * submissions are delivered is the FORM_RECIPIENT secret on the worker. */
export const CONTACT_EMAIL = "lepicuriennebywaycha@gmail.com";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = { name: 100, email: 254, phone: 30, message: 5000 } as const;

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  turnstileToken: string;
  company_website: string;
}

export type SendResult = "ok" | "rate_limited" | "error";

export async function sendContact(payload: ContactPayload): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (res.status === 429) return "rate_limited";
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  } finally {
    clearTimeout(timer);
  }
}
