"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Heart,
  Stethoscope,
  Utensils,
  GraduationCap,
  Loader2,
  RotateCcw,
  MessageCircle,
  Lock,
} from "lucide-react";
import { api, type DonationInitResponse } from "@/lib/api";
import { pollVerify } from "@/lib/donation";
import { Alert, Choice, Field, isValidPhone, SuccessPanel } from "./ui";

const tiers = [
  { amount: 10000, label: "Feeds 10 children" },
  { amount: 25000, label: "Equips a child for school" },
  { amount: 50000, label: "Stocks rural outreach medications" },
  { amount: 100000, label: "Sponsors a village feeding drive day" },
];

const categories = [
  { value: "where_needed", label: "Where needed most", icon: Heart },
  { value: "medical_supplies", label: "Medical supplies", icon: Stethoscope },
  { value: "feeding_drive", label: "Feeding drive", icon: Utensils },
  { value: "child_education", label: "Child education", icon: GraduationCap },
];

type Phase = "form" | "starting" | "checkout" | "verifying" | "success" | "pending";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Could not load the payment window.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () =>
      reject(new Error("Could not load the payment window. Check your connection and try again."));
    document.body.appendChild(script);
  });
}

export default function DonateForm({
  initialCategory,
  initialNote,
}: {
  initialCategory?: string;
  initialNote?: string;
}) {
  const [amount, setAmount] = useState(25000);
  const [custom, setCustom] = useState("");
  const [category, setCategory] = useState(
    categories.find((item) => item.value === initialCategory)?.value ?? "where_needed"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState(initialNote ?? "");
  const [gateway, setGateway] = useState<"paystack" | "flutterwave">("paystack");

  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const paidRef = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const finalAmount = custom ? Number(custom) : amount;
  const busy = phase === "starting" || phase === "checkout";
  const tier = custom ? undefined : tiers.find((item) => item.amount === amount);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function afterPayment(ref: string) {
    setPhase("verifying");
    scrollTop();
    const result = await pollVerify(ref);
    setPhase(result?.status === "success" ? "success" : "pending");
  }

  function handleClosed() {
    if (paidRef.current) return;
    setPhase("form");
    setNotice("The payment window was closed and no money was taken. You can try again whenever you are ready.");
  }

  async function openPaystack(response: DonationInitResponse) {
    await loadScript("https://js.paystack.co/v1/inline.js");
    const paystack = window as unknown as {
      PaystackPop: {
        setup: (options: Record<string, unknown>) => { openIframe: () => void };
      };
    };
    const handler = paystack.PaystackPop.setup({
      key: response.public_key,
      email: response.email,
      amount: response.init_payload?.amount ?? Math.round(response.amount * 100),
      currency: response.currency,
      ref: response.reference,
      metadata: response.init_payload?.metadata,
      callback: () => {
        paidRef.current = true;
        void afterPayment(response.reference);
      },
      onClose: handleClosed,
    });
    handler.openIframe();
  }

  async function openFlutterwave(response: DonationInitResponse) {
    await loadScript("https://checkout.flutterwave.com/v3.js");
    const flutterwave = window as unknown as {
      FlutterwaveCheckout: (
        options: Record<string, unknown>
      ) => { close: () => void };
    };
    const modal = flutterwave.FlutterwaveCheckout({
      public_key: response.public_key,
      tx_ref: response.reference,
      amount: response.amount,
      currency: response.currency,
      payment_options: "card,banktransfer,ussd",
      customer: response.customer ?? { email: response.email, name, phone_number: phone },
      customizations: response.customizations ?? {
        title: "Regal Foundation Donation",
        description: "Support our outreaches",
      },
      callback: (data: { status?: string }) => {
        if (data.status === "successful" || data.status === "completed") {
          paidRef.current = true;
          modal.close();
          void afterPayment(response.reference);
        } else {
          modal.close();
          handleClosed();
        }
      },
      onclose: handleClosed,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!Number.isFinite(finalAmount) || finalAmount < 100) {
      setError("Please enter a valid amount (minimum ₦100).");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      setError("Please enter a valid phone number, or leave it blank.");
      return;
    }

    paidRef.current = false;
    setPhase("starting");
    try {
      const response = await api.initiateDonation({
        amount: finalAmount,
        currency: "NGN",
        category,
        donor_name: name.trim(),
        donor_email: email.trim(),
        donor_phone: phone.trim() || undefined,
        is_anonymous: anonymous,
        message: message.trim() || undefined,
        gateway,
      });
      setReference(response.reference);

      if (!response.public_key || /x{4,}/i.test(response.public_key)) {
        throw new Error(
          `Online payments are not switched on yet (the ${gateway} public key has not been set on the server). Your reference is ${response.reference}.`
        );
      }

      if (response.gateway === "paystack") await openPaystack(response);
      else await openFlutterwave(response);
      setPhase("checkout");
    } catch (submitError) {
      setPhase("form");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again."
      );
    }
  }

  async function checkAgain() {
    setPhase("verifying");
    const result = await pollVerify(reference, 1);
    setPhase(result?.status === "success" ? "success" : "pending");
  }

  function reset() {
    setPhase("form");
    setError(null);
    setNotice(null);
    setCustom("");
    setMessage("");
    setReference("");
  }

  if (phase === "verifying") {
    return (
      <div ref={topRef} className="rounded-3xl bg-white p-12 text-center shadow-xl ring-1 ring-black/5">
        <Loader2 size={44} className="mx-auto animate-spin text-regal-forest" />
        <h2 className="mt-5 font-display text-2xl font-bold text-regal-navy">
          Confirming your payment…
        </h2>
        <p className="mt-2 text-regal-earth">
          This usually takes a few seconds. Please do not close this page.
        </p>
      </div>
    );
  }

  if (phase === "success") {
    const firstName = anonymous ? "friend" : name.trim().split(" ")[0] || "friend";
    return (
      <div ref={topRef}>
        <SuccessPanel
          title={`Thank you, ${firstName}!`}
          actions={
            <>
              <a
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/?text=${encodeURIComponent(
                  "I just supported the Regal Foundation's outreaches. Join me: " +
                    (typeof window !== "undefined" ? window.location.origin : "") +
                    "/get-involved/donate"
                )}`}
              >
                <MessageCircle size={18} /> Tell a friend
              </a>
              <button type="button" className="btn-secondary" onClick={reset}>
                <RotateCcw size={16} /> Give again
              </button>
              <Link href="/missions" className="btn-secondary">
                See our missions
              </Link>
            </>
          }
        >
          <p>
            Your gift of{" "}
            <strong className="text-regal-navy">₦{finalAmount.toLocaleString()}</strong> was
            received. It will help bring care, meals and school support to a rural community.
          </p>
          <p className="text-xs">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        </SuccessPanel>
      </div>
    );
  }

  if (phase === "pending") {
    return (
      <div ref={topRef} className="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5">
        <Loader2 size={40} className="mx-auto text-regal-forest" />
        <h2 className="mt-4 font-display text-2xl font-bold text-regal-navy">
          We are still confirming your payment
        </h2>
        <p className="mx-auto mt-2 max-w-md text-regal-earth">
          If you completed the payment, it can take a few minutes to show. You do not need to pay
          again. Keep this reference in case you need to contact us:
        </p>
        <p className="mt-3 font-mono text-sm font-semibold text-regal-navy">{reference}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary" onClick={checkAgain}>
            Check again
          </button>
          <Link href="/contact" className="btn-secondary">
            Contact us
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef}>
      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 md:p-8"
      >
        <fieldset disabled={busy}>
          <legend className="label">1. Choose an amount (₦)</legend>
          <div className="grid grid-cols-2 gap-2">
            {tiers.map((item) => (
              <button
                key={item.amount}
                type="button"
                onClick={() => {
                  setAmount(item.amount);
                  setCustom("");
                }}
                className={`rounded-xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 ${
                  !custom && amount === item.amount
                    ? "border-regal-gold bg-regal-gold/15 ring-2 ring-regal-gold"
                    : "border-gray-200 hover:border-regal-gold/60"
                }`}
              >
                <span className="font-display text-lg font-bold text-regal-navy">
                  ₦{item.amount.toLocaleString()}
                </span>
                <span className="mt-0.5 block text-xs text-regal-earth">{item.label}</span>
              </button>
            ))}
          </div>
          <input
            type="number"
            min={100}
            inputMode="numeric"
            placeholder="Or enter another amount (min ₦100)"
            aria-label="Custom amount in naira"
            className="input mt-2"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
          />
        </fieldset>

        <fieldset disabled={busy}>
          <legend className="label">2. Where should it go?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((item) => (
              <Choice
                key={item.value}
                selected={category === item.value}
                onClick={() => setCategory(item.value)}
                icon={<item.icon size={18} />}
              >
                {item.label}
              </Choice>
            ))}
          </div>
        </fieldset>

        <fieldset disabled={busy} className="space-y-4">
          <legend className="label">3. Your details</legend>
          <Field label="Full name" htmlFor="d-name" required>
            <input
              id="d-name"
              className="input"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Email"
              htmlFor="d-email"
              required
              hint="Your payment receipt is sent here by the payment provider."
            >
              <input
                id="d-email"
                type="email"
                className="input"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Field label="Phone (optional)" htmlFor="d-phone">
              <input
                id="d-phone"
                type="tel"
                className="input"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Field>
          </div>
          <Field label="Message (optional)" htmlFor="d-msg">
            <textarea
              id="d-msg"
              className="input"
              rows={2}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Give anonymously (your name will not be shown publicly)
          </label>
        </fieldset>

        <fieldset disabled={busy}>
          <legend className="label">4. Pay with</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["paystack", "flutterwave"] as const).map((provider) => (
              <Choice
                key={provider}
                selected={gateway === provider}
                onClick={() => setGateway(provider)}
                hint="Card, bank transfer, USSD"
              >
                <span className="capitalize">{provider}</span>
              </Choice>
            ))}
          </div>
        </fieldset>

        {error && <Alert>{error}</Alert>}
        {notice && <Alert tone="info">{notice}</Alert>}

        <div>
          <button type="submit" className="btn-primary w-full py-4 text-lg" disabled={busy}>
            {phase === "starting" ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Preparing secure checkout…
              </>
            ) : phase === "checkout" ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Complete payment in the window…
              </>
            ) : (
              <>
                <Heart size={20} /> Give ₦
                {(Number.isFinite(finalAmount) ? finalAmount : 0).toLocaleString()}
              </>
            )}
          </button>
          {tier && (
            <p className="mt-2 text-center text-sm text-regal-earth">
              This {tier.label.charAt(0).toLowerCase() + tier.label.slice(1)}.
            </p>
          )}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-regal-earth">
            <Lock size={12} /> Secure checkout. Card details go straight to{" "}
            {gateway === "paystack" ? "Paystack" : "Flutterwave"}, never to our servers.
          </p>
        </div>
      </form>
    </div>
  );
}
