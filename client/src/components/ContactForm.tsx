import { useState } from "react";
import { Turnstile } from "@/components/Turnstile";
import { CONTACT_EMAIL, EMAIL_RE, LIMITS, sendContact } from "@/lib/contact";

// "Envoyer un Message" form. It posts to /api/contact and only says the
// message was sent once the endpoint answered 2xx. Every failure shows the
// visible email address so the visitor can still reach the business.

type Language = "fr" | "en";
type Status = "idle" | "sending" | "sent" | "error" | "rate_limited";

const formCopy = {
  fr: {
    name: "Votre nom",
    email: "Courriel",
    phone: "Téléphone (facultatif)",
    message: "Votre demande",
    submit: "Envoyer",
    sending: "Envoi en cours...",
    consent: "J'accepte que mes renseignements soient utilisés pour répondre à ma demande.",
    privacy: `Les renseignements que vous transmettez servent uniquement à répondre à votre demande. Ils sont envoyés par courriel à L'Épicurienne By Waycha et ne sont pas conservés sur le site. Pour toute question sur vos renseignements personnels, écrivez à ${CONTACT_EMAIL}.`,
    privacyLink: "Politique de confidentialité",
    success: "Merci, votre message a bien été envoyé. Nous vous répondrons sous peu.",
    error: `Votre message n'a pas pu être envoyé. Veuillez réessayer dans quelques instants ou nous écrire directement à ${CONTACT_EMAIL}.`,
    rateLimited: "Vous avez envoyé plusieurs messages en peu de temps. Veuillez réessayer dans quelques minutes.",
    verify: "Veuillez compléter la vérification anti-robot avant d'envoyer.",
    invalidEmail: "Veuillez entrer une adresse courriel valide.",
    honeypot: "Ne pas remplir",
  },
  en: {
    name: "Your name",
    email: "Email",
    phone: "Phone (optional)",
    message: "Your request",
    submit: "Send",
    sending: "Sending...",
    consent: "I agree that my information may be used to answer my request.",
    privacy: `The information you provide is used only to answer your request. It is sent by email to L'Épicurienne By Waycha and is not stored on the site. For any question about your personal information, write to ${CONTACT_EMAIL}.`,
    privacyLink: "Privacy Policy",
    success: "Thank you, your message has been sent. We will get back to you shortly.",
    error: `Your message could not be sent. Please try again in a few moments or write to us directly at ${CONTACT_EMAIL}.`,
    rateLimited: "You have sent several messages in a short time. Please try again in a few minutes.",
    verify: "Please complete the anti-robot check before sending.",
    invalidEmail: "Please enter a valid email address.",
    honeypot: "Do not fill in",
  },
} as const;

const inputClass =
  "w-full px-5 md:px-6 py-4 md:py-5 bg-black/50 border border-white/10 rounded-xl md:rounded-2xl focus:outline-none focus:border-primary text-white placeholder:text-white/30 transition-colors text-base min-h-[44px] disabled:opacity-60";

interface Props {
  language: Language;
  onOpenPrivacy: () => void;
}

export function ContactForm({ language, onOpenPrivacy }: Props) {
  const c = formCopy[language];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");

  const sending = status === "sending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setNotice(c.invalidEmail);
      return;
    }
    if (!token) {
      setStatus("error");
      setNotice(c.verify);
      return;
    }

    setStatus("sending");
    setNotice("");
    const result = await sendContact({
      name,
      email,
      phone,
      message,
      consent,
      turnstileToken: token,
      company_website: honeypot,
    });
    // Turnstile tokens are single use, whatever the outcome.
    setResetSignal((n) => n + 1);

    if (result === "ok") {
      setStatus("sent");
      setNotice(c.success);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setConsent(false);
    } else if (result === "rate_limited") {
      setStatus("rate_limited");
      setNotice(c.rateLimited);
    } else {
      setStatus("error");
      setNotice(c.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 relative">
      <input type="text" required maxLength={LIMITS.name} autoComplete="name" aria-label={c.name} placeholder={c.name} value={name} onChange={(e) => setName(e.target.value)} disabled={sending} className={inputClass} />
      <input type="email" required maxLength={LIMITS.email} autoComplete="email" aria-label={c.email} placeholder={c.email} value={email} onChange={(e) => setEmail(e.target.value)} disabled={sending} className={inputClass} />
      <input type="tel" maxLength={LIMITS.phone} autoComplete="tel" aria-label={c.phone} placeholder={c.phone} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={sending} className={inputClass} />
      <textarea required rows={4} maxLength={LIMITS.message} aria-label={c.message} placeholder={c.message} value={message} onChange={(e) => setMessage(e.target.value)} disabled={sending} className={`${inputClass} resize-none min-h-[80px]`} />

      {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="contact-company-website">{c.honeypot}</label>
        <input id="contact-company-website" type="text" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <label htmlFor="contact-consent" className="flex items-start gap-3 text-xs md:text-sm text-white/60 leading-snug cursor-pointer text-left">
        <input id="contact-consent" type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={sending} className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer" />
        <span>{c.consent}</span>
      </label>

      <Turnstile
        language={language}
        onToken={setToken}
        onUnavailable={() => {
          setStatus("error");
          setNotice(c.error);
        }}
        resetSignal={resetSignal}
      />

      <button type="submit" disabled={sending} aria-busy={sending} className="w-full btn-cinematic mt-2 text-sm md:text-base py-4 min-h-[44px] flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-wait">
        {sending ? c.sending : c.submit}
      </button>

      <p className="text-[11px] md:text-xs text-white/40 leading-relaxed text-left">
        {c.privacy}{" "}
        <button type="button" onClick={onOpenPrivacy} className="underline hover:text-primary transition-colors cursor-pointer">
          {c.privacyLink}
        </button>
        .
      </p>

      <p
        role={status === "sent" ? "status" : "alert"}
        aria-live="polite"
        className={`text-sm leading-relaxed text-left ${notice ? "" : "sr-only"} ${status === "sent" ? "text-primary" : "text-red-300"}`}
      >
        {notice}
      </p>
    </form>
  );
}
