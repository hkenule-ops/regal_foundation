"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const pledgeTypes = [
  "medications",
  "food",
  "school_supplies",
  "logistics",
  "other",
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    organization_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    pledge_type: "medications",
    description: "",
    estimated_value: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      await api.submitPartner({
        organization_name: form.organization_name,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        contact_phone: form.contact_phone,
        pledge_type: form.pledge_type,
        description: form.description,
        estimated_value: form.estimated_value ? Number(form.estimated_value) : undefined,
        notes: form.notes || undefined,
      });
      setResult({
        ok: true,
        text: "Thank you. Our partnerships team will follow up on your pledge.",
      });
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof Error ? err.message : "Submission failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-gold">
        Corporate & In-Kind
      </p>
      <h1 className="section-heading">Partner With Us</h1>
      <p className="mt-2 text-sm text-regal-earth">
        Pharmaceutical companies, food brands, schools, and CSR teams — pledge goods, vehicles, or bulk sponsorship.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="label">Organization name</label>
          <input className="input" required value={form.organization_name} onChange={(e) => update("organization_name", e.target.value)} />
        </div>
        <div>
          <label className="label">Contact person</label>
          <input className="input" required value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" required value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" required value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} />
        </div>
        <div>
          <label className="label">Pledge type</label>
          <select className="input" value={form.pledge_type} onChange={(e) => update("pledge_type", e.target.value)}>
            {pledgeTypes.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Description of pledge</label>
          <textarea className="input" required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div>
          <label className="label">Estimated value (₦, optional)</label>
          <input type="number" className="input" value={form.estimated_value} onChange={(e) => update("estimated_value", e.target.value)} />
        </div>
        <div>
          <label className="label">Additional notes</label>
          <textarea className="input" rows={2} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Submitting…" : "Submit Pledge"}
        </button>

        {result && (
          <div className={`rounded-lg p-4 text-sm ${result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {result.text}
          </div>
        )}
      </form>
    </div>
  );
}
