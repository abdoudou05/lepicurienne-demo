import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile, explicit render. The public site key comes from
// GET /api/contact so the same static build works with the preview and the
// production key. Tokens are single use: bump `resetSignal` after every
// submission so the next one gets a fresh token.

type TurnstileApi = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  reset(id: string): void;
  remove(id: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let scriptPromise: Promise<void> | null = null;
let siteKeyPromise: Promise<string> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile script"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

function loadSiteKey(): Promise<string> {
  siteKeyPromise ??= fetch("/api/contact")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: { turnstileSiteKey?: string }) => d.turnstileSiteKey || Promise.reject(new Error("no key")))
    .catch((err) => {
      siteKeyPromise = null;
      throw err;
    });
  return siteKeyPromise;
}

interface Props {
  language: "fr" | "en";
  onToken: (token: string) => void;
  onUnavailable: () => void;
  resetSignal: number;
}

export function Turnstile({ language, onToken, onUnavailable, resetSignal }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Keep the latest callbacks without re-rendering the widget.
  const cb = useRef({ onToken, onUnavailable });
  useEffect(() => {
    cb.current = { onToken, onUnavailable };
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadSiteKey(), loadScript()])
      .then(([sitekey]) => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey,
          language,
          theme: "dark",
          // The full widget needs 300px; narrow cards on phones get compact.
          size: ref.current.offsetWidth < 300 ? "compact" : "flexible",
          callback: (token: string) => cb.current.onToken(token),
          "expired-callback": () => cb.current.onToken(""),
          "error-callback": () => cb.current.onToken(""),
        });
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) cb.current.onUnavailable();
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
    // The widget keeps the language it was rendered with; re-render on change.
  }, [language]);

  useEffect(() => {
    if (resetSignal > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      cb.current.onToken("");
    }
  }, [resetSignal]);

  return <div ref={ref} className={loaded ? "min-h-[65px]" : "min-h-0"} />;
}
