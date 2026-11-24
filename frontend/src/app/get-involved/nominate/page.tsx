"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const challenges = [
  { value: "healthcare_access", label: "Limited healthcare access" },
  { value: "malnutrition", label: "Malnutrition / food insecurity" },
  { value: "out_of_school", label: "Out-of-school children" },
];

export default function NominatePage() {
  const [form, setForm] = useState({
    community_name: "",
    state: "",
    lga: "",
    estimated_population: "",
    primary_challenges: [] as string[],
    description: "",
    submitter_name: "",
    submitter_role: "",
    submitter_phone: "",
    submitter_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleChallenge(v: string) {
    setForm((f) => ({
      ...f,
      primary_challenges: f.primary_challenges.includes(v)
        ? f.primary_challenges.filter((c) => c !== v)
        : [...f.primary_challenges, v],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      await api.submitNomination({
        community_name: form.community_name,
        state: form.state,
        lga: form.lga,
        estimated_population: form.estimated_population
          ? Number(form.estimated_population)
          : undefined,
        primary_challenges: form.primary_challenges,
        description: form.description || undefined,
        submitter_name: form.submitter_name,
        submitter_role: form.submitter_role,
        submitter_phone: form.submitter_phone,
        submitter_email: form.submitter_email || undefined,
      });
      setResult({
        ok: true,
        text: "Nomination received. Our team reviews submissions for future site assessments.",
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
        Nominate a Community
      </p>
      <h1 className="section-heading">Put a Village Forward</h1>
      <p className="mt-2 text-sm text-regal-earth">
        For village heads, youth leaders, local NGOs, and grassroots coordinators.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="label">Community / village name</label>
          <input className="input" required value={form.community_name} onChange={(e) => update("community_name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">State</label>
            <input className="input" required value={form.state} onChange={(e) => update("state", e.target.value)} />
          </div>
          <div>
            <label className="label">LGA</label>
            <input className="input" required value={form.lga} onChange={(e) => update("lga", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Estimated population</label>
          <input type="number" className="input" value={form.estimated_population} onChange={(e) => update("estimated_population", e.target.value)} />
        </div>
        <div>
          <label className="label">Primary challenges</label>
          <div className="space-y-2">
            {challenges.map((c) => (
              <label key={c.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.primary_challenges.includes(c.value)}
                  onChange={() => toggleChallenge(c.value)}
                  className="h-4 w-4 rounded"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Brief description</label>
          <textarea className="input" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <hr className="border-gray-200" />
        <div>
          <label className="label">Your name</label>
          <input className="input" required value={form.submitter_name} onChange={(e) => update("submitter_name", e.target.value)} />
        </div>
        <div>
          <label className="label">Your role (e.g. village head, youth leader)</label>
          <input className="input" required value={form.submitter_role} onChange={(e) => update("submitter_role", e.target.value)} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" required value={form.submitter_phone} onChange={(e) => update("submitter_phone", e.target.value)} />
        </div>
        <div>
          <label className="label">Email (optional)</label>
          <input type="email" className="input" value={form.submitter_email} onChange={(e) => update("submitter_email", e.target.value)} />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Submitting…" : "Submit Nomination"}
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
