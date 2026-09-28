"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Send } from "lucide-react";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Posts to Formspree when NEXT_PUBLIC_FORMSPREE_ID is set at build time (static-hosting friendly).
 * Without it, only the email link is shown.
 */
export function ContactForm({ email }: { email: string }) {
  const t = useTranslations("contact");
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const emailLink = (
    <p className="mt-4">
      {t.rich("emailUs", { email: () => <a href={`mailto:${email}`}>{email}</a> })}
    </p>
  );
  if (!formId) return emailLink;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    if (!String(data.get("name") ?? "").trim()) next.name = t("requiredField");
    const mail = String(data.get("email") ?? "").trim();
    if (!mail) next.email = t("requiredField");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) next.email = t("invalidEmail");
    if (!String(data.get("message") ?? "").trim()) next.message = t("requiredField");
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field = (name: keyof Errors, label: string, input: React.ReactNode) => (
    <div>
      <label htmlFor={`c-${name}`} className="block font-semibold">
        {label}
      </label>
      {input}
      {errors[name] && (
        <p id={`c-${name}-err`} className="mt-1 text-sm font-medium text-destructive">
          {errors[name]}
        </p>
      )}
    </div>
  );
  const aria = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `c-${name}-err` : undefined,
  });

  return (
    <>
      <form className="card mt-6 max-w-xl space-y-4 p-5" onSubmit={submit} noValidate>
        {field(
          "name",
          t("name"),
          <input
            id="c-name"
            name="name"
            autoComplete="name"
            className="input mt-1"
            {...aria("name")}
          />,
        )}
        {field(
          "email",
          t("email"),
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            className="input mt-1"
            {...aria("email")}
          />,
        )}
        {field(
          "message",
          t("message"),
          <textarea
            id="c-message"
            name="message"
            rows={6}
            className="input mt-1"
            {...aria("message")}
          />,
        )}
        <p className="text-sm text-muted-foreground">{t("privacyNote")}</p>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          <Send className="size-4" aria-hidden="true" />
          {status === "sending" ? t("sending") : t("send")}
        </button>
        <div role="status" aria-live="polite">
          {status === "success" && (
            <p className="flex items-center gap-2 font-medium text-success">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 font-medium text-destructive">
              <AlertTriangle className="size-4" aria-hidden="true" />
              {t("error")}
            </p>
          )}
        </div>
      </form>
      {emailLink}
    </>
  );
}
