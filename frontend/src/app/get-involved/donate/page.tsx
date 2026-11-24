import type { Metadata } from "next";
import DonateForm from "@/components/forms/DonateForm";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Regal Foundation outreach programs with a secure donation for healthcare, feeding and education.",
};

type Props = {
  searchParams: Promise<{ category?: string; note?: string }>;
};

export default async function DonatePage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-gold">
        Donate
      </p>
      <h1 className="section-heading">Support an Outreach</h1>
      <p className="mt-2 text-sm text-regal-earth">
        Secure payments via Paystack and Flutterwave. You&apos;ll receive an automated receipt.
      </p>
      <div className="mt-8">
        <DonateForm initialCategory={params.category} initialNote={params.note} />
      </div>
    </div>
  );
}
