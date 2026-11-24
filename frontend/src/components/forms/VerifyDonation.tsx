"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RotateCcw } from "lucide-react";
import { pollVerify } from "@/lib/donation";
import { SuccessPanel, Alert } from "./ui";

type State = "checking" | "success" | "pending" | "missing" | "cancelled";

export default function VerifyDonation({
  reference,
  cancelled,
}: {
  reference: string;
  cancelled?: boolean;
}) {
  const [state, setState] = useState<State>(
    cancelled ? "cancelled" : reference ? "checking" : "missing"
  );

  async function check(attempts = 6) {
    setState("checking");
    const r = await pollVerify(reference, attempts);
    setState(r?.status === "success" ? "success" : "pending");
  }

  useEffect(() => {
    if (state === "checking") void check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "checking") {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-xl ring-1 ring-black/5">
        <Loader2 size={44} className="mx-auto animate-spin text-regal-forest" />
        <h1 className="mt-5 font-display text-2xl font-bold text-regal-navy">Confirming your payment…</h1>
        <p className="mt-2 text-regal-earth">Please wait a moment.</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <SuccessPanel
        title="Thank you for giving!"
        actions={
          <>
            <Link href="/missions" className="btn-primary">See our missions</Link>
            <Link href="/" className="btn-secondary">Back to home</Link>
          </>
        }
      >
        <p>Your donation was confirmed. It will help bring care, meals and school support to a community in need.</p>
        <p className="text-xs">Reference: <span className="font-mono">{reference}</span></p>
      </SuccessPanel>
    );
  }

  if (state === "cancelled") {
    return (
      <div className="space-y-5 text-center">
        <Alert tone="info">The payment was cancelled and no money was taken.</Alert>
        <Link href="/get-involved/donate" className="btn-primary">
          <RotateCcw size={16} /> Try again
        </Link>
      </div>
    );
  }

  if (state === "missing") {
    return (
      <div className="space-y-5 text-center">
        <Alert>We could not find a payment reference in this link.</Alert>
        <Link href="/get-involved/donate" className="btn-primary">Go to the donate page</Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5">
      <h1 className="font-display text-2xl font-bold text-regal-navy">We are still confirming your payment</h1>
      <p className="mx-auto mt-2 max-w-md text-regal-earth">
        If you completed the payment, it can take a few minutes to show. You do not need to pay again.
      </p>
      <p className="mt-3 font-mono text-sm font-semibold text-regal-navy">{reference}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-primary" onClick={() => check(1)}>Check again</button>
        <Link href="/contact" className="btn-secondary">Contact us</Link>
      </div>
    </div>
  );
}