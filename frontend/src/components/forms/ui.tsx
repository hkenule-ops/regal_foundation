import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-regal-earth">{hint}</p>}
    </div>
  );
}

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "info";
  children: ReactNode;
}) {
  const styles =
    tone === "error"
      ? "bg-red-50 text-red-800 ring-red-200"
      : "bg-regal-gold/15 text-regal-navy ring-regal-gold/40";
  const Icon = tone === "error" ? AlertCircle : Info;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl p-4 text-sm ring-1 ${styles}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

/** Pill-style toggle used for roles, challenges, pledge types, etc. */
export function Choice({
  children,
  selected,
  onClick,
  icon,
  hint,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition duration-200 hover:-translate-y-0.5 ${
        selected
          ? "border-regal-gold bg-regal-gold/15 ring-2 ring-regal-gold"
          : "border-gray-200 bg-white hover:border-regal-gold/60"
      }`}
    >
      {icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
            selected ? "bg-regal-gold text-regal-navy" : "bg-regal-cream text-regal-navy"
          }`}
        >
          {icon}
        </span>
      )}
      <span>
        <span className="block font-semibold text-regal-navy">{children}</span>
        {hint && <span className="block text-xs text-regal-earth">{hint}</span>}
      </span>
    </button>
  );
}

export function SuccessPanel({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="animate-fade-up rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5 md:p-12">
      <div className="animate-pulse-ring mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-regal-gold text-regal-navy">
        <CheckCircle2 size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-regal-navy">{title}</h2>
      <div className="mx-auto mt-3 max-w-md space-y-2 text-regal-earth">{children}</div>
      {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}

/** Accepts local or international numbers: 10 to 15 digits once spaces, dashes and + are removed. */
export function isValidPhone(value: string) {
  return /^\d{10,15}$/.test(value.replace(/[\s\-()+]/g, ""));
}
