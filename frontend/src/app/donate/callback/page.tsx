import type { Metadata } from "next";
import VerifyDonation from "@/components/forms/VerifyDonation";

export const metadata: Metadata = { title: "Confirming your donation", robots: { index: false } };

type Props = {
  searchParams: Promise<{ reference?: string; trxref?: string; tx_ref?: string; status?: string }>;
};

/**
 * Paystack and Flutterwave redirect donors here after payment
 * (backend callback_url = FRONTEND_URL/donate/callback). We verify the payment
 * and show a thank-you or a "still confirming" message.
 */
export default async function DonateCallbackPage({ searchParams }: Props) {
  const sp = await searchParams;
  const reference = sp.reference || sp.trxref || sp.tx_ref || "";
  const cancelled = sp.status === "cancelled";
  return (
    <div className="mx-auto max-w-xl px-4 py-20 md:px-6">
      <VerifyDonation reference={reference} cancelled={cancelled} />
    </div>
  );
}